import React, { useEffect, useState } from "react";
import "../css/Board.css";
import {
  setTurn,
  setWinner,
  subscribeToBoard,
  subscribeToLastClue,
  updateCardInFirebase,
} from "../services/firebaseService";
import Card from "./Card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Board = ({ gameId, user, team, isSpymaster, currentTurn, winner }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guessCount, setGuessCount] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [lastClue, setLastClue] = useState(null);
  const [bonusUsed, setBonusUsed] = useState(false);

  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameId}/board/${user.uid}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("❌ שגיאה בטעינת הלוח:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && user?.uid) fetchBoard();
  }, [gameId, user?.uid]);

  useEffect(() => {
    if (!gameId) return;
    const unsubBoard = subscribeToBoard(gameId, fetchBoard);
    const unsubClue = subscribeToLastClue(gameId, (clue) => {
      setLastClue(clue);
      setGuessCount(0);
      setCorrectGuesses(0);
      setBonusUsed(false);
      console.log("📥 רמז חדש התקבל:", clue);
    });
    return () => {
      unsubBoard();
      unsubClue();
    };
  }, [gameId]);

  const handleCardClick = async (card) => {
    if (!card || card.isRevealed || winner) return;
    if (team !== currentTurn || isSpymaster) return;
    if (!lastClue || lastClue.team !== currentTurn) return;

    const res = await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${card.cardID}`, { method: "PUT" });
    if (!res.ok) return;

    await updateCardInFirebase(gameId, { ...card, isRevealed: true });
    await fetchBoard();

    const cardTeam = card.team?.trim();
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    const correct = cardTeam === currentTurn;
    if (correct) setCorrectGuesses((prev) => prev + 1);

    const isAssassin = cardTeam === "Assassin";
    const isOpponent = cardTeam !== currentTurn && cardTeam !== "Neutral" && cardTeam !== "Assassin";
    const isNeutral = cardTeam === "Neutral";

    if (isAssassin) {
      await setWinner(gameId, currentTurn === "Red" ? "Blue" : "Red");
      console.log("💀 מתנקש – הקבוצה הפסידה!");
      return;
    }

    const red = cards.filter(c => c.isRevealed && c.team === "Red").length + (cardTeam === "Red" ? 1 : 0);
    const blue = cards.filter(c => c.isRevealed && c.team === "Blue").length + (cardTeam === "Blue" ? 1 : 0);
    if (red === 8) return await setWinner(gameId, "Red");
    if (blue === 8) return await setWinner(gameId, "Blue");

    const maxGuesses = lastClue?.number ?? 0;

    if (isOpponent || isNeutral) {
      console.log("⛔ ניחוש שגוי (נייטרלי או יריב) – מסיים את התור");
      await setTurn(gameId, currentTurn === "Red" ? "Blue" : "Red");
      return;
    }

    const allCorrect = correctGuesses + (correct ? 1 : 0);
    const reachedMax = newGuessCount === maxGuesses;

    if (reachedMax && allCorrect === maxGuesses && !bonusUsed) {
      console.log("🎁 כל הניחושים הצליחו – מציעים בונוס לשחקן");
      toast(
        ({ closeToast }) => (
          <div>
            🎉 ניחשתם בהצלחה את כל הקלפים!<br />
            רוצים לנצל ניחוש בונוס?
            <div className="flex gap-2 mt-2 justify-center">
              <button onClick={() => {
                console.log("🟢 השחקן בחר לממש את ניחוש הבונוס");
                setBonusUsed(true);
                closeToast();
              }} className="bg-green-500 text-white px-3 py-1 rounded">כן</button>
              <button onClick={async () => {
                console.log("❌ השחקן ויתר על הבונוס – התור עובר");
                await setTurn(gameId, currentTurn === "Red" ? "Blue" : "Red");
                closeToast();
              }} className="bg-gray-500 text-white px-3 py-1 rounded">לא</button>
            </div>
          </div>
        ),
        { autoClose: false, position: "top-center" }
      );
      return;
    }

    if ((reachedMax && allCorrect !== maxGuesses) || (bonusUsed && newGuessCount > maxGuesses)) {
      console.log("🔁 מיצוי ניחושים או סיום בונוס – תור עובר");
      await setTurn(gameId, currentTurn === "Red" ? "Blue" : "Red");
      return;
    }

    console.log(`✅ ניחוש ${newGuessCount} מתוך ${maxGuesses}${bonusUsed ? " (כולל בונוס)" : ""}`);
  };

  if (loading) return <p className="text-center">⏳ טוען לוח...</p>;
  if (cards.length === 0) return <p className="text-center text-red-500">😢 אין קלפים להצגה</p>;

  return (
    <div className="board-container">
      {cards.map((card) => (
        <Card
          key={card.cardID}
          card={card}
          gameId={gameId}
          canClick={!card.isRevealed && !winner}
          onCardRevealed={handleCardClick}
          currentTurn={currentTurn}
          userTeam={team}
          isSpymaster={isSpymaster}
        />
      ))}
    </div>
  );
};

export default Board;

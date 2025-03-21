import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useThemeStore } from "@/stores/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";

const WORDS = [
  "REACT",
  "APPLE",
  "NODES",
  "INPUT",
  "STACK",
  "CRANE",
  "BLAST",
  "ROUTE",
  "TIMER",
  "PLANT",
];

const WORD_OF_THE_DAY = WORDS[Math.floor(Math.random() * WORDS.length)];
const MAX_ATTEMPTS = 6;
const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function WordleScreen() {
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: string }>({});
  const isDarkMode = useThemeStore((state) => state.isDark);
  const isDark = isDarkMode;

  const checkGuess = (input: string) => {
    if (input.length !== 5) return;

    const result = input.split("").map((letter, index) => {
      if (letter === WORD_OF_THE_DAY[index]) return "correct";
      if (WORD_OF_THE_DAY.includes(letter)) return "present";
      return "absent";
    });

    const updatedUsed = { ...usedLetters };
    input.split("").forEach((letter, i) => {
      const status = result[i];
      const current = updatedUsed[letter];
      if (!current || (current !== "correct" && status === "correct")) {
        updatedUsed[letter] = status;
      } else if (
        current !== "correct" &&
        current !== "present" &&
        status === "present"
      ) {
        updatedUsed[letter] = "present";
      } else if (!current) {
        updatedUsed[letter] = status;
      }
    });

    setAttempts([...attempts, input]);
    setFeedback([...feedback, result]);
    setUsedLetters(updatedUsed);
    setGuess("");
  };

  const handleLetterPress = (letter: string) => {
    if (guess.length >= 5 || attempts.length >= MAX_ATTEMPTS) return;
    setGuess((prev) => prev + letter);
  };

  const handleReset = () => {
    setGuess("");
    setAttempts([]);
    setFeedback([]);
    setUsedLetters({});
  };

  const handleBackspace = () => {
    setGuess((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (guess.length === 5) {
      checkGuess(guess);
    }
  };

  if (guess === WORD_OF_THE_DAY) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.title, isDark && styles.darkText]}>You Win!</Text>
        <Text style={isDark && styles.darkText}>
          The word was {WORD_OF_THE_DAY}
        </Text>
        <TouchableOpacity onPress={handleReset} style={styles.playAgainButton}>
          <Text style={[styles.keyText, { textAlign: "center" }]}>
            Play Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (attempts.length >= MAX_ATTEMPTS) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.title, isDark && styles.darkText]}>Game Over</Text>
        <Text style={isDark && styles.darkText}>
          The word was {WORD_OF_THE_DAY}
        </Text>
        <TouchableOpacity onPress={handleReset} style={styles.playAgainButton}>
          <Text style={[styles.keyText, { textAlign: "center" }]}>
            Play Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView
        style={[styles.container, isDark && styles.darkContainer]}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      >
        <Text style={[styles.title, isDark && styles.darkText]}>Word Game</Text>
        <Text style={isDark && styles.darkText}>
          6 Guesses - Green: letter is in the correct location. Yellow: word
          contains letter, but it's in the wrong spot. Grey: letter is not used.
        </Text>

        <View style={styles.attemptsContainer}>
          {attempts.map((attempt, rowIdx) => (
            <View key={rowIdx} style={styles.attemptRow}>
              {attempt.split("").map((char, colIdx) => {
                const status = feedback[rowIdx][colIdx];
                return (
                  <View
                    key={colIdx}
                    style={[
                      styles.letterBox,
                      status === "correct" && styles.correct,
                      status === "present" && styles.present,
                      status === "absent" && styles.absent,
                    ]}
                  >
                    <Text style={styles.letterText}>{char}</Text>
                  </View>
                );
              })}
            </View>
          ))}

          {attempts.length < MAX_ATTEMPTS && (
            <View style={styles.attemptRow}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.letterBox, styles.emptyBox]}>
                  <Text style={styles.letterText}>{guess[i] || ""}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.keyboardContainer}>
          {LETTERS.map((letter) => {
            const status = usedLetters[letter];
            return (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterPress(letter)}
                disabled={
                  guess.length >= 5 ||
                  attempts.length >= MAX_ATTEMPTS ||
                  status === "absent"
                }
                style={[
                  styles.key,
                  status === "correct" && styles.correct,
                  status === "present" && styles.present,
                  status === "absent" && styles.absent,
                ]}
              >
                <Text style={styles.keyText}>{letter}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={handleBackspace}
            style={[styles.key, styles.largeKey]}
          >
            <Text style={styles.keyText}>← Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.key, styles.largeKey]}
          >
            <Text style={styles.keyText}>⏎ Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.key, styles.largeKey]}
          >
            <Text style={styles.keyText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BOX_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#1A1A1A",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  darkText: {
    color: "#fff",
  },
  attemptsContainer: {
    marginBottom: 20,
  },
  attemptRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  letterBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    marginHorizontal: 4,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  emptyBox: {
    backgroundColor: "#eee",
  },
  correct: {
    backgroundColor: "#6aaa64",
  },
  present: {
    backgroundColor: "#c9b458",
  },
  absent: {
    backgroundColor: "#787c7e",
  },
  letterText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  keyboardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  key: {
    width: 36,
    height: 48,
    margin: 4,
    borderRadius: 4,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  largeKey: {
    width: 90,
    height: 48,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  playAgainButton: {
    backgroundColor: "lightgreen",
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignSelf: "center",
  },
});

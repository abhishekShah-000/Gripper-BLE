import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const QuestionsScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ name: '', dob: '', fitness: '' });

  const questions = [
    { question: 'Name', type: 'text' },
    { question: 'Date of Birth', type: 'date' },
    { question: 'Level of Fitness', type: 'select', options: ['Easy', 'Medium', 'Hard'] }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handleInputChange = (value) => {
    const newAnswers = { ...answers };
    if (currentQuestion === 0) newAnswers.name = value;
    if (currentQuestion === 1) newAnswers.dob = value;
    if (currentQuestion === 2) newAnswers.fitness = value;
    setAnswers(newAnswers);
  };

  const handleFitnessSelection = (value) => {
    setAnswers({ ...answers, fitness: value });
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      {questions[currentQuestion].type === 'text' && (
        <TextInput
          style={styles.input}
          value={answers.name}
          onChangeText={handleInputChange}
        />
      )}
      {questions[currentQuestion].type === 'date' && (
        <Text style={styles.input}>Date picker should be implemented here</Text>
      )}
      {questions[currentQuestion].type === 'select' && (
        <View>
          {questions[currentQuestion].options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.button}
              onPress={() => handleFitnessSelection(option)}
            >
              <Text style={styles.buttonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {questions[currentQuestion].type !== 'select' && (
        <Button title="Next" onPress={handleNext} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  question: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default QuestionsScreen;

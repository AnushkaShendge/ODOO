import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Component to render markdown content in React Native
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Parse markdown content into structured format
  const parseMarkdown = (markdownText) => {
    const sections = [];
    const lines = markdownText.split('\n');
    
    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        sections.push({ type: 'h1', content: line.replace('# ', '') });
      } else if (line.startsWith('## ')) {
        sections.push({ type: 'h2', content: line.replace('## ', '') });
      } else if (line.startsWith('### ')) {
        sections.push({ type: 'h3', content: line.replace('### ', '') });
      } else if (line.includes('|')) {
        const lastSection = sections[sections.length - 1];
        if (lastSection && lastSection.type === 'table') {
          lastSection.rows.push(line);
        } else {
          sections.push({ type: 'table', rows: [line] });
        }
      } else if (line.trim() !== '') {
        sections.push({ type: 'text', content: line });
      } else {
        sections.push({ type: 'spacer' });
      }
    });
    
    return sections;
  };
  
  const processTableRow = (row) => {
    return row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  };
  
  const processBoldText = (text) => {
    if (!text) return [];
    
    const parts = [];
    let currentText = '';
    let inBold = false;
    let i = 0;
    
    while (i < text.length) {
      if (i + 1 < text.length && text[i] === '*' && text[i + 1] === '*') {
        if (currentText) {
          parts.push({ bold: inBold, text: currentText });
          currentText = '';
        }
        inBold = !inBold;
        i += 2;
      } else {
        currentText += text[i];
        i++;
      }
    }
    
    if (currentText) {
      parts.push({ bold: inBold, text: currentText });
    }
    
    return parts;
  };
  
  const renderFormattedText = (text) => {
    const parts = processBoldText(text);
    
    return (
      <Text>
        {parts.map((part, index) => (
          <Text key={index} style={part.bold ? styles.boldText : null}>
            {part.text}
          </Text>
        ))}
      </Text>
    );
  };
  
  const parsedContent = parseMarkdown(content);
  
  return (
    <ScrollView style={styles.markdownContainer}>
      {parsedContent.map((section, index) => {
        switch (section.type) {
          case 'h1':
            return <Text key={index} style={styles.h1}>{section.content}</Text>;
          case 'h2':
            return <Text key={index} style={styles.h2}>{section.content}</Text>;
          case 'h3':
            return <Text key={index} style={styles.h3}>{section.content}</Text>;
          case 'text':
            return (
              <Text key={index} style={styles.paragraph}>
                {renderFormattedText(section.content)}
              </Text>
            );
          case 'spacer':
            return <View key={index} style={styles.spacer} />;
          case 'table':
            if (section.rows.length === 0) return null;
            
            const tableRows = section.rows.map(row => processTableRow(row));
            const headerRow = tableRows[0];
            const dataRows = tableRows.slice(1);
            
            return (
              <View key={index} style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  {headerRow.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles.tableHeaderCell}>
                      <Text style={styles.tableHeaderText}>
                        {renderFormattedText(cell)}
                      </Text>
                    </View>
                  ))}
                </View>
                {dataRows.map((row, rowIndex) => (
                  <View key={rowIndex} style={[
                    styles.tableRow,
                    rowIndex % 2 === 0 ? styles.tableRowEven : {}
                  ]}>
                    {row.map((cell, cellIndex) => (
                      <View key={cellIndex} style={styles.tableCell}>
                        <Text style={styles.tableCellText}>
                          {renderFormattedText(cell)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          default:
            return null;
        }
      })}
    </ScrollView>
  );
};

// Main component
const GeminiChatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const callGeminiAPI = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const apiKey = 'AIzaSyACNnrdq6ueJPz-3-KlXUHKgXTmRnhCwtg'; // Replace with your real Gemini API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const journeyPrompt = `
        Based on the following user input: "${prompt}"
        
        Generate a detailed career journey analysis with the following:
        1. Current salary vs. last year's salary comparison, with growth percentage calculated
        2. Industry benchmark comparison (use reasonable estimates if not provided)
        3. 5-year career progression projection (assume a reasonable annual growth rate if not specified)
        4. Recommended actions based on the input
        
        Format the response **only in Markdown tables** with headers using #. Use Indian Rupees (₹) for all monetary values. Highlight key figures (e.g., current salary, growth rates, projected milestones) in **bold**. Do not include any text outside of tables. If specific data (e.g., salaries, industry) is missing, infer reasonable values based on context and note assumptions in the table.
      `;

      const result = await model.generateContent(journeyPrompt);
      const generatedContent = result.response.text();

      if (!generatedContent.includes('|') || !generatedContent.includes('#')) {
        throw new Error('API response does not contain valid Markdown tables');
      }

      setResponse(generatedContent);
    } catch (error) {
      console.error('Error calling Gemini API:', error);

      let errorMsg = 'Failed to get response from Gemini API';
      if (error.message) {
        errorMsg += `: ${error.message}`;
      }

      setErrorMessage(errorMsg);
      Alert.alert('API Error', errorMsg, [{ text: 'OK' }]);

      // Dynamic fallback based on user input
      const numbers = prompt.match(/\d+/g) || ['7000000', '6200000']; // Default if no numbers found
      const currSalaryNum = parseInt(numbers[0], 10);
      const lastSalaryNum = parseInt(numbers[1] || numbers[0] * 0.9, 10); // Assume 10% less if not provided
      const growthRate = lastSalaryNum ? (((currSalaryNum - lastSalaryNum) / lastSalaryNum) * 100).toFixed(1) : 'N/A';

      const fallbackResponse = `
# Career Journey Analysis

| Metric             | Value             | Benchmark         |
|--------------------|-------------------|-------------------|
| Current Salary     | **₹${currSalaryNum.toLocaleString('en-IN')}** | ₹${(currSalaryNum * 0.97).toLocaleString('en-IN')} |
| Last Year's Salary | ₹${lastSalaryNum.toLocaleString('en-IN')}    | ₹${(lastSalaryNum * 1.02).toLocaleString('en-IN')} |
| Growth Rate        | **${growthRate}%**| Assumed 8%        |

| Industry Position  | Percentile   | Outlook       |
|--------------------|--------------|---------------|
| Compensation Rank  | **Assumed 70th** | Above Average |
| Growth Trajectory  | **Top 20%**  | Strong        |
| Market Demand      | High         | Stable        |

| Year | Projected Salary         | Growth Opportunity |
|------|--------------------------|--------------------|
| 2025 | ₹${currSalaryNum.toLocaleString('en-IN')}          | Current           |
| 2026 | **₹${(currSalaryNum * 1.09).toLocaleString('en-IN')}** | **+9.0%**         |
| 2027 | ₹${(currSalaryNum * 1.18).toLocaleString('en-IN')}     | +9.0%             |
| 2028 | ₹${(currSalaryNum * 1.28).toLocaleString('en-IN')}     | +9.0%             |
| 2029 | **₹${(currSalaryNum * 1.39).toLocaleString('en-IN')}** | **+10.0%**        |

| Priority | Action                    | Impact |
|----------|---------------------------|--------|
| 1        | **Upskill in Relevant Field** | High   |
| 2        | Certification             | Medium |
| 3        | Networking                | Medium |
| 4        | **Negotiate Raise**       | High   |
      `;
      setResponse(fallbackResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Career Journey Analyzer</Text>
          
          <View style={styles.inputArea}>
            <TextInput
              style={styles.promptInput}
              multiline
              numberOfLines={5}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter your career details (e.g., current salary ₹70,00,000, last year's salary ₹62,00,000, industry, years of experience)"
              placeholderTextColor="#888"
            />
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!prompt || loading) && styles.disabledButton
              ]}
              disabled={!prompt || loading}
              onPress={callGeminiAPI}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Analyze Career Journey</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {response ? (
            <View style={styles.responseArea}>
              <Text style={styles.responseTitle}>Analysis Results</Text>
              <MarkdownRenderer content={response} />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputArea: {
    marginBottom: 20,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4285f4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  responseArea: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  markdownContainer: {
    flex: 1,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 6,
    color: '#333',
  },
  spacer: {
    height: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#d94235',
  },
  tableContainer: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRowEven: {
    backgroundColor: '#f2f2f2',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    backgroundColor: '#4285f4',
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableCellText: {
    fontSize: 14,
  },
});

export default GeminiChatbot;
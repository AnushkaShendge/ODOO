import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G, Text as SvgText, Line } from 'react-native-svg';

// Sample data
const expenses = [
  { category: 'Housing', amount: 1200, id: 1, color: '#FF6384' },
  { category: 'Food', amount: 400, id: 2, color: '#36A2EB' },
  { category: 'Transportation', amount: 200, id: 3, color: '#FFCE56' },
  { category: 'Entertainment', amount: 150, id: 4, color: '#4BC0C0' },
  { category: 'Utilities', amount: 250, id: 5, color: '#9966FF' },
  { category: 'Shopping', amount: 300, id: 6, color: '#FF9F40' },
  { category: 'Healthcare', amount: 180, id: 7, color: '#8AC979' },
];

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{ data: [2500, 2700, 2800, 2600, 2400, 2900], color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, strokeWidth: 2 }],
  legend: ['Expenses'],
};

const savingsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{ data: [1000, 900, 600, 1200, 1300, 1000], color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, strokeWidth: 2 }],
  legend: ['Savings'],
};

const planTreeData = {
  goals: [
    { id: 1, title: "Emergency Fund", description: "Build 6-month emergency fund", target: 10000, current: 4000, timeline: "Q2 2023", color: "#4A6FFF", subgoals: [1, 2] },
    { id: 2, title: "Debt Freedom", description: "Pay off all high-interest debt", target: 8000, current: 3500, timeline: "Q3 2023", color: "#FF6384", subgoals: [3, 4] },
    { id: 3, title: "Home Purchase", description: "Save for down payment", target: 25000, current: 7500, timeline: "Q1 2024", color: "#FFCE56", subgoals: [5, 6] },
    { id: 4, title: "Retirement", description: "Increase retirement contributions", target: 12000, current: 2000, timeline: "Q4 2023", color: "#4BC0C0", subgoals: [7] },
  ],
  subgoals: [
    { id: 1, title: "Cut Expenses", description: "Reduce non-essential spending by 20%", parentGoal: 1, status: "In Progress", timeline: "Monthly" },
    { id: 2, title: "Side Income", description: "Generate $500/month from side projects", parentGoal: 1, status: "Not Started", timeline: "Q2 2023" },
    { id: 3, title: "Credit Card Debt", description: "Pay off highest interest card first", parentGoal: 2, status: "In Progress", timeline: "Q2 2023" },
    { id: 4, title: "Personal Loan", description: "Make extra payments on personal loan", parentGoal: 2, status: "Not Started", timeline: "Q3 2023" },
    { id: 5, title: "Housing Budget", description: "Set aside 15% of income for housing fund", parentGoal: 3, status: "In Progress", timeline: "Monthly" },
    { id: 6, title: "Research Mortgages", description: "Compare rates and requirements", parentGoal: 3, status: "Not Started", timeline: "Q4 2023" },
    { id: 7, title: "401(k) Increase", description: "Increase contribution by 2%", parentGoal: 4, status: "Not Started", timeline: "Q3 2023" },
  ],
};

const screenWidth = Dimensions.get('window').width;

const ExpenseDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summaryAnimation] = useState(new Animated.Value(0));
  const [chartAnimation] = useState(new Animated.Value(0));
  const [goalAnimation] = useState(new Animated.Value(0));
  const [treeAnimation] = useState(new Animated.Value(0));
  const [nodeAnimations] = useState(planTreeData.goals.map(() => new Animated.Value(0)));
  const [lineAnimations] = useState(planTreeData.goals.map(() => new Animated.Value(0)));
  const [expandedGoals, setExpandedGoals] = useState({}); // Track expanded state for each goal

  const animatePlanTree = () => {
    nodeAnimations.forEach(anim => anim.setValue(0));
    lineAnimations.forEach(anim => anim.setValue(0));
    treeAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(treeAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.stagger(300, nodeAnimations.map(anim => Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }))),
      Animated.stagger(200, lineAnimations.map(anim => Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }))),
    ]).start();
  };

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(summaryAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(chartAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(goalAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    if (activeTab === 'plan') {
      animatePlanTree();
    }
  }, [activeTab]);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = 3000;
  const remainingBudget = totalBudget - totalExpenses;
  const savingsGoalProgress = 45;

  const pieChartData = expenses.map(item => ({
    name: item.category,
    population: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  const renderFamilyTree = () => {
    const rootX = screenWidth / 2;
    const rootY = 100;
    const level1Y = 250; // Y position for first-level goals
    const level2Y = 400; // Y position for second-level subgoals
    const level1Spacing = (screenWidth - 100) / planTreeData.goals.length; // Spacing for first-level goals

    const goalIcons = {
      "Emergency Fund": "🏦",
      "Debt Freedom": "💸",
      "Home Purchase": "🏠",
      "Retirement": "👴",
    };

    const subgoalIcons = {
      "Cut Expenses": "✂️",
      "Side Income": "💰",
      "Credit Card Debt": "💳",
      "Personal Loan": "📝",
      "Housing Budget": "🏡",
      "Research Mortgages": "🔍",
      "401(k) Increase": "📈",
    };

    // Calculate dynamic height based on expanded goals
    const hasExpanded = Object.values(expandedGoals).some(expanded => expanded);
    const svgHeight = hasExpanded ? 600 : 450;

    return (
      <Animated.View style={[styles.treeContainer, {
        opacity: treeAnimation,
        transform: [{ translateY: treeAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
      }]}>
        <Text style={styles.treeTitleText}>Your Money Family Tree</Text>
        <Text style={styles.treeSubtitleText}>Tap to see how your money branches out</Text>

        <Svg height={svgHeight} width={screenWidth - 40}>
          {/* Root Node (Income) */}
          <G>
            <Circle cx={rootX} cy={rootY} r={40} fill="#4A6FFF" stroke="#fff" strokeWidth={2} />
            <SvgText fill="#fff" fontSize="20" x={rootX} y={rootY + 5} textAnchor="middle">💼</SvgText>
            <SvgText fill="#fff" fontSize="12" x={rootX} y={rootY + 25} textAnchor="middle">Income</SvgText>
          </G>

          {/* First-Level Nodes (Goals) */}
          {planTreeData.goals.map((goal, index) => {
            const goalX = 50 + (index + 0.5) * level1Spacing; // Center each goal
            const progress = (goal.current / goal.target) * 100;

            // Calculate positions for subgoals
            const level2Spacing = goal.subgoals.length > 1 ? 100 : 0; // Spacing for subgoals
            const isExpanded = expandedGoals[goal.id];

            return (
              <G key={`goal-${goal.id}`}>
                {/* Line from Root to Goal */}
                <Line
                  x1={rootX}
                  y1={rootY + 40}
                  x2={goalX}
                  y2={level1Y - 40}
                  stroke="#36A2EB"
                  strokeWidth={2}
                  strokeOpacity={lineAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 0.8] })}
                />
                {/* Money Flow Animation */}
                {[0.25, 0.5, 0.75].map((segment, i) => {
                  const segX = rootX + (goalX - rootX) * segment;
                  const segY = (rootY + 40) + (level1Y - 40 - (rootY + 40)) * segment;
                  return (
                    <Circle
                      key={`flow-${index}-${i}`}
                      cx={segX}
                      cy={segY}
                      r={5}
                      fill="#8AC979"
                      opacity={lineAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, i === 0 ? 0.9 : i === 1 ? 0.6 : 0.3] })}
                    />
                  );
                })}
                {/* Goal Node */}
                <TouchableOpacity
                  onPress={() => setExpandedGoals(prev => ({
                    ...prev,
                    [goal.id]: !prev[goal.id],
                  }))}
                >
                  <G>
                    <Circle
                      cx={goalX}
                      cy={level1Y}
                      r={35}
                      fill="#fff"
                      stroke={goal.color}
                      strokeWidth={2}
                      opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                    />
                    <SvgText
                      fill={goal.color}
                      fontSize="20"
                      x={goalX}
                      y={level1Y + 5}
                      textAnchor="middle"
                      opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                    >
                      {goalIcons[goal.title]}
                    </SvgText>
                    <SvgText
                      fill="#333"
                      fontSize="10"
                      x={goalX}
                      y={level1Y + 25}
                      textAnchor="middle"
                      opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                    >
                      {progress.toFixed(0)}%
                    </SvgText>
                  </G>
                </TouchableOpacity>

                {/* Second-Level Nodes (Subgoals) */}
                {isExpanded && goal.subgoals.map((subgoalId, subIndex) => {
                  const subgoal = planTreeData.subgoals.find(sg => sg.id === subgoalId);
                  if (!subgoal) return null;

                  const subgoalX = goalX + (subIndex - (goal.subgoals.length - 1) / 2) * level2Spacing;
                  const statusColor = subgoal.status === "In Progress" ? "#FFCE56" : subgoal.status === "Completed" ? "#4BC0C0" : "#FF6384";

                  return (
                    <G key={`subgoal-${subgoal.id}`}>
                      <Line
                        x1={goalX}
                        y1={level1Y + 35}
                        x2={subgoalX}
                        y2={level2Y - 30}
                        stroke="#ddd"
                        strokeWidth={2}
                        strokeDasharray="4,4"
                        strokeOpacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 0.8] })}
                      />
                      <Circle
                        cx={subgoalX}
                        cy={level2Y}
                        r={30}
                        fill="#fff"
                        stroke={statusColor}
                        strokeWidth={2}
                        opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                      />
                      <SvgText
                        fill={statusColor}
                        fontSize="16"
                        x={subgoalX}
                        y={level2Y + 5}
                        textAnchor="middle"
                        opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                      >
                        {subgoalIcons[subgoal.title]}
                      </SvgText>
                      <SvgText
                        fill="#666"
                        fontSize="10"
                        x={subgoalX}
                        y={level2Y + 25}
                        textAnchor="middle"
                        opacity={nodeAnimations[index].interpolate({ inputRange: [0, 1], outputRange: [0, 1] })}
                      >
                        {subgoal.title.split(" ")[0]}
                      </SvgText>
                    </G>
                  );
                })}
              </G>
            );
          })}
        </Svg>

        <View style={styles.visualKey}>
          <Text style={styles.visualKeyTitle}>Easy Guide</Text>
          <View style={styles.visualKeyItem}>
            <View style={[styles.keyIcon, { backgroundColor: '#4A6FFF' }]} />
            <Text style={styles.keyText}>Your Money Root</Text>
          </View>
          <View style={styles.visualKeyItem}>
            <View style={[styles.keyIcon, { backgroundColor: '#8AC979' }]} />
            <Text style={styles.keyText}>Money Flow</Text>
          </View>
          <View style={styles.visualKeyItem}>
            <Text style={[styles.keyText, { marginRight: 10 }]}>Colors:</Text>
            <View style={[styles.keyIcon, { backgroundColor: '#FF6384' }]} />
            <Text style={styles.keyText}>Not Done</Text>
            <View style={[styles.keyIcon, { backgroundColor: '#FFCE56' }]} />
            <Text style={styles.keyText}>Working On</Text>
            <View style={[styles.keyIcon, { backgroundColor: '#4BC0C0' }]} />
            <Text style={styles.keyText}>Done</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.animateButton} onPress={animatePlanTree}>
          <MaterialIcons name="replay" size={18} color="#fff" />
          <Text style={styles.animateButtonText}>Watch Money Flow</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <Animated.View style={[styles.summaryContainer, { opacity: summaryAnimation }]}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: '#ffe8e8' }]}>
                    <FontAwesome5 name="money-bill-wave" size={20} color="#FF6384" />
                  </View>
                  <Text style={styles.cardTitle}>Total Expenses</Text>
                </View>
                <Text style={styles.cardValue}>${totalExpenses}</Text>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${(totalExpenses / totalBudget) * 100}%` }]} />
                </View>
                <Text style={styles.cardSubtext}>{((totalExpenses / totalBudget) * 100).toFixed(0)}% of monthly budget</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: '#e3f9f7' }]}>
                    <FontAwesome5 name="piggy-bank" size={20} color="#4BC0C0" />
                  </View>
                  <Text style={styles.cardTitle}>Remaining Budget</Text>
                </View>
                <Text style={styles.cardValue}>${remainingBudget}</Text>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${(remainingBudget / totalBudget) * 100}%`, backgroundColor: '#4BC0C0' }]} />
                </View>
                <Text style={styles.cardSubtext}>{((remainingBudget / totalBudget) * 100).toFixed(0)}% left for this month</Text>
              </View>
            </Animated.View>
            <Animated.View style={[styles.chartContainer, { opacity: chartAnimation, transform: [{ translateY: chartAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
              <Text style={styles.sectionTitle}>Expense Breakdown</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Animated.View>
            <Animated.View style={[styles.chartContainer, { opacity: chartAnimation, transform: [{ translateY: chartAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
              <Text style={styles.sectionTitle}>Monthly Expense Trend</Text>
              <LineChart
                data={monthlyData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </Animated.View>
          </>
        );
      case 'analytics':
        return (
          <>
            <Animated.View style={[styles.chartContainer, { opacity: chartAnimation, transform: [{ translateY: chartAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
              <Text style={styles.sectionTitle}>Savings Tracker</Text>
              <LineChart
                data={savingsData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
              />
            </Animated.View>
            <Animated.View style={[styles.goalsContainer, { opacity: goalAnimation, transform: [{ translateY: goalAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
              <Text style={styles.sectionTitle}>Savings Goals</Text>
              <View style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: '#f0e7ff' }]}>
                    <FontAwesome5 name="plane-departure" size={20} color="#9966FF" />
                  </View>
                  <Text style={styles.goalTitle}>Vacation Fund</Text>
                </View>
                <View style={styles.goalProgressRow}>
                  <View style={styles.goalProgressContainer}>
                    <View style={[styles.goalProgressBar, { width: `${savingsGoalProgress}%` }]} />
                  </View>
                  <Text style={styles.goalPercentage}>{savingsGoalProgress}%</Text>
                </View>
                <View style={styles.goalDetails}>
                  <Text style={styles.goalAmount}>$2,250 saved of $5,000 goal</Text>
                  <Text style={styles.goalTimeLeft}>3 months left</Text>
                </View>
              </View>
            </Animated.View>
          </>
        );
      case 'plan':
        return renderFamilyTree();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Dashboard</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'overview' && styles.activeTab]} onPress={() => setActiveTab('overview')}>
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'analytics' && styles.activeTab]} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'plan' && styles.activeTab]} onPress={() => setActiveTab('plan')}>
          <Text style={[styles.tabText, activeTab === 'plan' && styles.activeTabText]}>Yearly Plan</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {renderTabContent()}
        {activeTab === 'overview' && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#ffe8e8' }]}>
                <MaterialIcons name="add" size={24} color="#FF6384" />
              </View>
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#e3f9f7' }]}>
                <MaterialIcons name="insert-chart" size={24} color="#4BC0C0" />
              </View>
              <Text style={styles.actionText}>Budget Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#f0e7ff' }]}>
                <MaterialIcons name="settings" size={24} color="#9966FF" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' , marginTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#e5e9f0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  notificationButton: { padding: 8 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e5e9f0', backgroundColor: '#fff' },
  tab: { paddingVertical: 15, marginRight: 20, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#4A6FFF' },
  tabText: { color: '#888', fontWeight: '500' },
  activeTabText: { color: '#4A6FFF', fontWeight: 'bold' },
  scrollView: { flex: 1, padding: 20 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  cardTitle: { fontSize: 12, color: '#888', flex: 1 },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  progressContainer: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: '#FF6384', borderRadius: 3 },
  cardSubtext: { fontSize: 11, color: '#888' },
  chartContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  goalsContainer: { marginBottom: 20 },
  goalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  goalTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  goalProgressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  goalProgressContainer: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, flex: 1, marginRight: 10 },
  goalProgressBar: { height: 8, backgroundColor: '#9966FF', borderRadius: 4 },
  goalPercentage: { fontSize: 14, fontWeight: 'bold', color: '#9966FF', width: 40, textAlign: 'right' },
  goalDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  goalAmount: { fontSize: 12, color: '#666' },
  goalTimeLeft: { fontSize: 12, color: '#888' },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 },
  actionButton: { alignItems: 'center', width: '30%' },
  actionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, color: '#666' },
  treeContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 2, alignItems: 'center' },
  treeTitleText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  treeSubtitleText: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  visualKey: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginTop: 20, marginBottom: 20, width: '100%' },
  visualKeyTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  visualKeyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', justifyContent: 'center' },
  keyIcon: { width: 16, height: 16, borderRadius: 8, marginRight: 10, marginLeft: 5 },
  keyText: { fontSize: 13, color: '#666', marginRight: 10 },
  animateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4A6FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignSelf: 'center', marginTop: 10, marginBottom: 20 },
  animateButtonText: { color: '#fff', fontSize: 14, fontWeight: '500', marginLeft: 5 },
});

export default ExpenseDashboard;
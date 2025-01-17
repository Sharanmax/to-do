import React, { useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View, Platform } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AddTodoModal from '@/components/AddTodoModal';
import TodoItem from '@/components/TodoItem'; // Import the reusable component
import { useTodos } from '@/context/TodoContext';
import { arrColors } from '@/constants/util';

export default function TabOneScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { state, dispatch } = useTodos(); // Access global state and dispatch

  // Calculate Progress
  const completedTasks = state.todos.filter((task) => task.completed).length;
  const totalTasks = state.todos.length;

  const progressData = {
    labels: ['Completed'], // Only one dataset for a single ring
    data: [totalTasks > 0 ? completedTasks / totalTasks : 0], // Only the completed percentage
  };

  const handleAddTodo = (newTodo) => {
    dispatch({
      type: 'ADD_TODO',
      payload: { ...newTodo, id: Date.now(), creationDate: new Date().toISOString() },
    });
  };

  const handleToggleTodo = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const handleDeleteTodo = (id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleEditTodo = (updatedTodo) => {
    dispatch({
      type: 'EDIT_TODO',
      payload: updatedTodo, // Pass the updated todo directly
    });
  };

  return (
    <View style={styles.container}>
      {/* Doughnut Chart */}
      <View style={styles.chartContainer}>
        <ProgressChart
          data={progressData}
          width={Dimensions.get('window').width * 0.8} // Adjust width for better alignment
          height={200}
          strokeWidth={20} // Thick stroke width for a doughnut effect
          radius={80} // Radius size for the ring
          chartConfig={{
            backgroundColor: '#000',
            backgroundGradientFrom: '#000',
            backgroundGradientTo: '#000',
            color: (opacity = 1) => `rgba(132, 130, 143, ${opacity})`, // Color for the completed ring
          }}
          style={{ marginBottom: 20 }}
          hideLegend={true}
        />
        <Text style={styles.chartText}>
          Completed: {((completedTasks / totalTasks) * 100 || 0).toFixed(1)}%
        </Text>
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8}}>Pending tasks</Text>
      <FlatList
        data={state.todos.filter((item)=> item.completed !== true)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TodoItem
            id={item.id}
            title={item.title}
            completed={item.completed}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            color={arrColors[(index % 6)]}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found!</Text>}
      />

      {/* Add Todo Modal */}
      <AddTodoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddTaskToState={handleAddTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0B0500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chartText: {
    color: '#fff',
    fontSize: 16,
    marginTop: -20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#709255',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});
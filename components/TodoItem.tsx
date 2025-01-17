import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For the delete icon
import Checkbox from 'expo-checkbox'; // Checkbox component
import AddTodoModal from '@/components/AddTodoModal'; // Reuse AddTodoModal

interface TodoItemProps {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  color: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (updatedTodo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    creationDate: string;
  }) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  description,
  dueDate,
  completed,
  onToggle,
  onDelete,
  onEdit,
  color = '#fff'
}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const handleSaveEdit = (updatedTodo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    creationDate: string;
  }) => {
    onEdit(updatedTodo);
    setEditModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: color, shadowColor: color}]}>
      {/* Checkbox to the left */}
      <Checkbox
        value={completed}
        onValueChange={() => onToggle(id)}
        style={styles.checkbox}
        color={completed ? '#4CAF50' : undefined}
      />

      {/* Task Title */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onLongPress={() => setEditModalVisible(true)} // Show modal on long press
      >
        <Text style={[styles.text, completed && styles.completedText]}>{title}</Text>
      </TouchableOpacity>

      {/* Delete Icon to the right */}
      <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteIcon}>
        <FontAwesome name="trash" size={20} color="#000" />
      </TouchableOpacity>

      {/* Edit Modal */}
      {isEditModalVisible && <AddTodoModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onAddTaskToState={handleSaveEdit} // Use the edit handler
        initialData={{
          id,
          title,
          description,
          dueDate,
          completed,
          creationDate: new Date().toISOString(), // Pass creation date if available
        }}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 2, // Adds a subtle shadow for Android
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: '50%',
    borderColor: '#000'
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  completedText: {
    textDecorationLine: 'line-through', // Strikes through completed tasks
    color: '#888',
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default TodoItem;
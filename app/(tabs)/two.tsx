import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Expo Vector Icons
import AddTodoModal from '@/components/AddTodoModal';
import TodoItem from '@/components/TodoItem'; // Reusable TodoItem Component
import { useTodos } from '@/context/TodoContext';
import { arrColors } from '@/constants/util';

export default function TabTwoScreen() {
  const { state, dispatch } = useTodos();
  const [isModalVisible, setIsModalVisible] = useState(false); // Add Todo Modal
  const [isSortModalVisible, setIsSortModalVisible] = useState(false); // Sort Modal
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); // Filter Modal
  const [searchText, setSearchText] = useState(''); // Search text
  const [sortOption, setSortOption] = useState('creationDate'); // Sort option
  const [filterStatus, setFilterStatus] = useState('All'); // Filter option

  // Filtered and Sorted Todos (Optimized with useMemo)
  const processedTodos = useMemo(() => {
    let todos = [...state.todos];

    // Filter todos based on status
    if (filterStatus === 'Completed') {
      todos = todos.filter((todo) => todo.completed);
    } else if (filterStatus === 'Pending') {
      todos = todos.filter((todo) => !todo.completed);
    }

    // Filter by search text
    todos = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (todo.description?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    // Sort todos based on the selected sort option
    todos.sort((a, b) => {
      if (sortOption === 'creationDate') {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      } else if (sortOption === 'dueDate') {
        return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return todos;
  }, [state.todos, filterStatus, searchText, sortOption]);

  // Handlers for Todo Actions
  const handleAddTodo = (newTodo) => {
    dispatch({
      type: 'ADD_TODO',
      payload: { ...newTodo, id: Date.now(), creationDate: new Date().toISOString() },
    });
  };

  const handleToggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleEditTodo = (updatedTodo) => {
    dispatch({ type: 'EDIT_TODO', payload: updatedTodo });
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Icons */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setIsSortModalVisible(true)}>
          <MaterialIcons name="sort" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <MaterialIcons name="filter-list" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search by title or description"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Todo List */}
      <FlatList
        data={processedTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TodoItem
            id={item.id}
            title={item.title}
            completed={item.completed}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            color={arrColors[index % arrColors.length]} // Cycle through colors
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

      {/* Sort Modal */}
      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsSortModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Sort By</Text>
                {['creationDate', 'dueDate', 'title'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modalButton,
                      sortOption === option && styles.activeModalButton,
                    ]}
                    onPress={() => {
                      setSortOption(option);
                      setIsSortModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      {option === 'creationDate'
                        ? 'Creation Date'
                        : option === 'dueDate'
                          ? 'Due Date'
                          : 'Title'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Filter By Status</Text>
                {['All', 'Completed', 'Pending'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.modalButton,
                      filterStatus === status && styles.activeModalButton,
                    ]}
                    onPress={() => {
                      setFilterStatus(status);
                      setIsFilterModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0B0500',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeModalButton: {
    backgroundColor: '#709255',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
});
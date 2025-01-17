import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Todo Item type
interface TodoItem {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    creationDate: string;
}

// Define the Action types
type Action =
    | { type: 'ADD_TODO'; payload: TodoItem }
    | { type: 'DELETE_TODO'; payload: number }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'EDIT_TODO'; payload: TodoItem }
    | { type: 'SET_TODOS'; payload: TodoItem[] }; // For restoring state

// Define the state type
interface TodoState {
    todos: TodoItem[];
}

// Reducer function to manage the todo state
const todoReducer = (state: TodoState, action: Action): TodoState => {
    switch (action.type) {
        case 'ADD_TODO':
            return { todos: [...state.todos, action.payload] };
        case 'DELETE_TODO':
            return { todos: state.todos.filter((todo) => todo.id !== action.payload) };
        case 'TOGGLE_TODO':
            return {
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };
        case 'EDIT_TODO':
            return {
                todos: state.todos.map((todo) =>
                    todo.id === action.payload.id ? { ...action.payload } : todo
                ),
            };
        case 'SET_TODOS':
            return { todos: action.payload }; // Restore todos from storage
        default:
            return state;
    }
};

// Create the Context
const TodoContext = createContext<{
    state: TodoState;
    dispatch: React.Dispatch<Action>;
    loading: boolean; // Add loading state to the context
} | null>(null);

// Hook to use the Todo Context
export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};

// Provider component
interface TodoProviderProps {
    children: ReactNode; // Accept children as a prop
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, { todos: [] });
    const [loading, setLoading] = useState(true); // Manage loading state

    // Persist state to AsyncStorage whenever it changes
    useEffect(() => {
        const saveTodosToStorage = async () => {
            try {
                console.log('Saving todos:', JSON.stringify(state.todos));
                if(state.todos.length){
                    await AsyncStorage.setItem('todos', JSON.stringify(state.todos));
                }
            } catch (error) {
                console.error('Failed to save todos to AsyncStorage', error);
            }
        };
        saveTodosToStorage();
    }, [state.todos]);

    // Restore state from AsyncStorage on app load
    useEffect(() => {
        const loadTodosFromStorage = async () => {
            try {
                const storedTodos = await AsyncStorage.getItem('todos');
                console.log('Retrieved todos from AsyncStorage:', storedTodos); // Log retrieved todos
                if (storedTodos) {
                    dispatch({ type: 'SET_TODOS', payload: JSON.parse(storedTodos) });
                }
            } catch (error) {
                console.error('Failed to load todos from AsyncStorage', error);
            } finally {
                setLoading(false); // Set loading to false after restoring state
            }
        };
        loadTodosFromStorage();
    }, []);

    if (loading) {
        // Optionally, return a loading screen or null while restoring state
        return null;
    }

    return (
        <TodoContext.Provider value={{ state, dispatch, loading }}>
            {children}
        </TodoContext.Provider>
    );
};
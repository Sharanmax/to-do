import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useTodos } from '@/context/TodoContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TodoItem {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    creationDate: string;
}

const AddTodoModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onAddTaskToState: (task: TodoItem) => void;
    initialData?: TodoItem; // Optional prop for editing an existing task
}> = ({ visible, onClose, onAddTaskToState, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { state } = useTodos();

    // Populate the fields when editing
    useEffect(() => {
        if (initialData) {
            const updatedItem =
                state.todos.find((todo) => todo.id === initialData.id) || {
                    title: '',
                    description: '',
                    dueDate: '',
                };

            setTitle(updatedItem.title);
            setDescription(updatedItem.description || '');
            setDueDate(updatedItem.dueDate || '');
        }
    }, [initialData]);

    const handleSaveTodo = () => {
        if (title.trim() === '') {
            alert('Task Title is required!');
            return;
        }

        const task: TodoItem = {
            id: initialData?.id || Date.now(), // Use existing ID if editing, else generate a new one
            title,
            description,
            dueDate,
            completed: initialData?.completed || false,
            creationDate: initialData?.creationDate || new Date().toISOString(), // Preserve creation date if editing
        };

        onAddTaskToState(task); // Save the task (either new or edited)
        resetFields();
        onClose();
    };

    const resetFields = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {initialData ? 'Edit Task' : 'Add New Task'}
                    </Text>

                    {/* Task Title */}
                    <TextInput
                        style={styles.input}
                        placeholder="Task Title"
                        placeholderTextColor="#888"
                        value={title}
                        onChangeText={setTitle}
                    />

                    {/* Task Description */}
                    <TextInput
                        style={styles.input}
                        placeholder="Description (optional)"
                        placeholderTextColor="#888"
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Due Date */}
                    {Platform.OS === 'web' ? (
                        // Use HTML5 Date Picker on Web
                        <TextInput
                            style={styles.input}
                            placeholder="Select Due Date"
                            placeholderTextColor="#888"
                            value={dueDate}
                            onFocus={(e) => {
                                e.currentTarget.type = 'date';
                            }}
                            onChangeText={(value) => setDueDate(value)}
                        />
                    ) : (
                        // Use Native DateTimePicker on Mobile
                        <>
                            <TouchableOpacity
                                style={[styles.input, { justifyContent: 'center' }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={{ color: dueDate ? '#000' : '#888' }}>
                                    {dueDate || 'Select Due Date'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={dueDate ? new Date(dueDate) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </>
                    )}

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTodo}>
                            <Text style={styles.buttonText}>
                                {initialData ? 'Update Task' : 'Add Task'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#D7C0D0',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#B4B8AB',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#77BA99',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#0B0500',
        fontWeight: 'bold',
    },
});

export default AddTodoModal;
import React, { useState } from 'react';
import UpdateModal from './UpdateModal';
import { useSelector } from 'react-redux';

interface Task {
    _id: string;
    title: string;
    details: string
}

interface TaskListModalProps {
    tasks: Task[];
    onClose: () => void;
    fetch: any
}

interface RootState {
    auth: {
        userLoggedin: boolean;
        role: string;
        userId: string;
    };
}

const TaskListModal: React.FC<TaskListModalProps> = ({ tasks, onClose,fetch}) => {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const { role } = useSelector((state: RootState) => state.auth);

    const handleTaskClick = (taskId: string) => {
        if (role !== 'Employee') {
            setSelectedTaskId(taskId);
        }
    };

    const handleUpdateModalClose = () => {
        setSelectedTaskId(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-1/3 h-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">Tasks</h2>
                {tasks.length > 0 ? (
                    <ul className="mb-4">
                        {tasks.map(task => (
                            <li
                                key={task._id}
                                className={`mb-2 p-2 rounded cursor-pointer ${
                                    role === 'employee' ? 'hover:bg-transparent' : 'hover:bg-gray-100'
                                }`}
                                onClick={() => handleTaskClick(task._id)}
                            >
                                {task.title}
                                {role === 'Employee' && (
                                    <span className="block text-sm text-gray-500">
                                        Details: {task.details}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks.</p>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
            {selectedTaskId && role !== 'Employee' && (
                <UpdateModal
                    close={onClose}
                    reload={fetch}
                    onClose={handleUpdateModalClose}
                    taskId={selectedTaskId}
                />
            )}
        </div>
    );
};

export default TaskListModal;
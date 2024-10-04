import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createTask, getEmployees } from '../../api/apiClient';
import { useSelector } from 'react-redux';

interface TaskModalProps {
    onClose: () => void;
    date: string | null;
    fetch: () => void;
}

interface Employee {
    _id: string;
    name: string;
}

interface RootState {
    auth: {
        userLoggedin: boolean;
        role: string;
        userId: string;
    };
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, date, fetch }) => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [employees, setEmployees] = useState<Array<string>>([]);
    const managerId = userId;

    const { data: empData, isLoading } = useQuery({
        queryKey: ['Employees', managerId],
        queryFn: () => getEmployees(managerId),
        select: (data) => data.data.employees,
    });

    const { mutate: create } = useMutation({
        mutationFn: createTask,
        onSuccess: (response) => {
            if (response?.status === 201) {
                onClose();
                fetch();
            }
        }
    });

    const handleCreateTask = () => {
        const data = {
            title,
            details,
            date,
            employeeIds: employees,
            managerId,
        };
        create(data);
    };

    const toggleEmployeeSelection = (id: string) => {
        setEmployees((prev) =>
            prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Task</h2>
                        <button
                            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors p-2"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-row justify-normal gap-3">
                    <div className="border-e-2 flex-grow">
                        <div className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <input
                                        id="title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        placeholder="Add a title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        id="description"
                                        className="w-full px-3 py-2 border border-gray-300 rounded h-24"
                                        placeholder="Add a description or attach documents"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={handleCreateTask}
                                className="px-4 py-2 rounded border border-gray-300 transition-colors bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow w-1/5">
                        <p className="font-semibold mb-2">Employees</p>
                        <ul className="space-y-2">
                            {isLoading ? (
                                <li>Loading employees...</li>
                            ) : (
                                empData?.map((employee: Employee) => (
                                    <li
                                        key={employee._id}
                                        className="flex items-center cursor-pointer"
                                        onClick={() => toggleEmployeeSelection(employee._id)}
                                    >
                                        <span className={`mr-2 ${employees.includes(employee._id) ? 'text-green-500' : 'text-gray-500'}`}>
                                            {employees.includes(employee._id) ? '✔️' : '❌'}
                                        </span>
                                        {employee.name}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
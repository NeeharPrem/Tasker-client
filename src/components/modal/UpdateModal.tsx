import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTaskDetails, deleteTask, getEmployees, updateTask } from '../../api/apiClient';
import { useSelector } from 'react-redux';

interface UpdateModalProps {
    onClose: () => void;
    taskId: string;
    close: ()=> void;
    reload:any
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

const UpdateModal: React.FC<UpdateModalProps> = ({ onClose, taskId,close,reload}) => {
    const [title, setTitle] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [assignedEmployees, setAssignedEmployees] = useState<Array<string>>([]);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const { userId } = useSelector((state: RootState) => state.auth);
    const managerId = userId;

    console.log(taskId,'djdj')

    const { data: taskData, isLoading: isLoadingTask, isError: isErrorTask } = useQuery({
        queryKey: ['taskDetail', taskId],
        queryFn: () => getTaskDetails(taskId),
    });
    
    console.log(managerId,'ug')
    const { data: empData, isLoading: isLoadingEmployees, isError: isErrorEmployees } = useQuery({
        queryKey: ['Employees', managerId],
        queryFn: ({ queryKey }) => getEmployees(queryKey[1]),
    });
    let out
    if(empData){
        out=empData?.data
    }

    const mutation = useMutation({
        mutationFn: () => deleteTask(taskId),
        onSuccess: () => {
            console.log('Task deleted successfully');
            onClose();
            close()
            reload()
        },
    });

    const { mutate: update } = useMutation({
        mutationFn: updateTask,
        onSuccess: (response) => {
            if (response?.status === 200) {
                onClose();
            }
        },
    });

    useEffect(() => {
        if (taskData) {
            setTitle(taskData.task.title);
            setDetails(taskData.task.details);
            setAssignedEmployees(taskData.task.assignedTo.map((emp: { _id: any; }) => emp._id));
        }
    }, [taskData]);

    const handleCreatTask = () => {
        const data = {
            title,
            details,
            employeeIds: assignedEmployees,
            taskId: taskId,
            managerId: managerId,
        };
        console.log(data);
        update(data);
    };

    const handleDeleteTask = () => {
        mutation.mutate();
    };

    const toggleEmployeeSelection = (id: string) => {
        setAssignedEmployees((prev) =>
            prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
        );
    };

    if (isLoadingTask || isLoadingEmployees) return <div>Loading...</div>;
    if (isErrorTask) return <div>Error loading task details</div>;
    if (isErrorEmployees) return <div>Error loading employees</div>;
    console.log(out)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full h-max max-w-4xl">
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
                                        className={`w-full px-3 py-2 border border-gray-300 rounded h-24`}
                                        placeholder="Add a description or attach documents"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-between">
                            <button
                                onClick={handleCreatTask}
                                className="px-4 py-2 rounded border border-gray-300 transition-colors bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsConfirmingDelete(true)}
                                className="px-4 py-2 rounded border border-red-300 transition-colors bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow w-1/5">
                        <p className="font-semibold">Employees:</p>
                        {out && out.employees.length > 0 ? (
                            <ul>
                                {out.employees.map((employee: Employee) => (
                                    <li
                                        key={employee._id}
                                        className="flex items-center cursor-pointer border-b py-2"
                                        onClick={() => toggleEmployeeSelection(employee._id)}
                                    >
                                        <span
                                            className={`mr-2 ${assignedEmployees.includes(employee._id) ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {assignedEmployees.includes(employee._id) ? '✔️' : '❌'}
                                        </span>
                                        {employee.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No employees available.</p>
                        )}
                    </div>
                </div>
            </div>

            {isConfirmingDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setIsConfirmingDelete(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTask}
                                className="px-4 py-2 rounded border border-red-300 transition-colors bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateModal;
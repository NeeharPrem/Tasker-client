import React, { useState, useEffect } from 'react';
import TaskModal from '../modal/TaskModal';
import TaskListModal from '../modal/TaskListModal';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../api/apiClient';
import { useSelector } from 'react-redux';

interface RootState {
    auth: {
        userLoggedin: boolean;
        role: string;
        userId: string;
    };
}

const Calendar: React.FC = () => {
    const { role, userId } = useSelector((state: RootState) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskListModalOpen, setTaskListModalOpen] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysOfWeek: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const adjustedFirstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    function CustomDate() {
        const customDate = new Date(Date.UTC(2024, 9, 10, 0, 0, 0));
        const year = customDate.getUTCFullYear();
        const month = String(customDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(customDate.getUTCDate()).padStart(2, '0');
        const hours = String(customDate.getUTCHours()).padStart(2, '0');
        const minutes = String(customDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(customDate.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(customDate.getUTCMilliseconds()).padStart(3, '0');
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;

        return formattedDate;
    }

    let dateOut = CustomDate();
    
    const { data: Data, isLoading, isError, refetch: allTasks } = useQuery({
        queryKey: ['dateDetail', role, userId],
        queryFn: () => getTasks({
            managerId: role === 'Manager' ? userId : undefined,
            employeeId: role === 'Employee' ? userId : undefined,
            title: '',
            details: '',
            date: dateOut,
            role: role
        }),
    });

    useEffect(() => {
        if (Data && Data.tasks) {
            setTasks(Data.tasks);
        } else {
            setTasks([]); // Ensure tasks is an empty array if no data is returned
        }
    }, [Data]);

    const handleDate = (day: number) => {
        const selected = new Date(currentYear, currentMonth, day, 12);
        const isoString = selected.toISOString();
        const formattedDate = isoString.slice(0, -1) + '+00:00';
        setSelectedDate(formattedDate);

        const tasksForDate = tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getFullYear() === selected.getFullYear() &&
                taskDate.getMonth() === selected.getMonth() &&
                taskDate.getDate() === selected.getDate()
            );
        });

        setTasksForSelectedDate(tasksForDate);

        if (role === 'Manager') {
            if (tasksForDate.length > 0) {
                setTaskListModalOpen(true);
            } else {
                setIsModalOpen(true);
            }
        } else if (role === 'Employee' && tasksForDate.length > 0) {
            setTaskListModalOpen(true);
        }
    };

    const hasTaskOnDate = (day: number) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        const dateToCheckMidnight = new Date(
            dateToCheck.getFullYear(),
            dateToCheck.getMonth(),
            dateToCheck.getDate()
        );

        return tasks.some((task: any) => {
            const taskDate = new Date(task.date);
            const taskDateMidnight = new Date(
                taskDate.getFullYear(),
                taskDate.getMonth(),
                taskDate.getDate()
            );
            return taskDateMidnight.getTime() === dateToCheckMidnight.getTime();
        });
    };

    if (isLoading) return <div>Loading tasks...</div>;

    // If there's an error, we log it but still show the calendar
    if (isError) {
        console.error('Error loading tasks');
        // You could optionally display an error message here while still showing the calendar
    }

    return (
        <main className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day) => (
                    <div key={day} className="p-2 text-sm font-medium text-center">
                        {day}
                    </div>
                ))}

                {[...Array(adjustedFirstDayOfMonth)].map((_, index) => {
                    const day = 30 - adjustedFirstDayOfMonth + index + 1;
                    return (
                        <div key={`prev-${index}`} className="p-2 min-h-24 text-gray-400">
                            <span className="text-sm">{day}</span>
                        </div>
                    );
                })}

                {[...Array(numberOfDaysInMonth)].map((_, index) => {
                    const day = index + 1;
                    return (
                        <div
                            onClick={() => handleDate(day)}
                            key={`current-${index}`}
                            className="p-2 border min-h-24 hover:border-blue-500 relative cursor-pointer"
                        >
                            <span className="text-sm">{day}</span>
                            {hasTaskOnDate(day) && (
                                <div className="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded-sm"></div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                {role === 'Manager' && isModalOpen && (
                    <TaskModal fetch={allTasks} date={selectedDate} onClose={() => setIsModalOpen(false)} />
                )}
                {taskListModalOpen && (
                    <TaskListModal fetch={allTasks} tasks={tasksForSelectedDate} onClose={() => setTaskListModalOpen(false)} />
                )}
            </div>
        </main>
    );
};

export default Calendar;
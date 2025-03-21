import React, {useEffect, useState} from 'react';
import {ArrowLeft, ArrowRight, Clock, X} from 'lucide-react';
import Footer from './Footer.js';
import {Link, useNavigate} from "react-router-dom";
import { Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserPlus, Users } from 'lucide-react';
import {Switch} from "@headlessui/react";
import AddNewEmployee from "./employee_sub/AddNewEmployee.js";



export default function Employees() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [bgColor, setBgColor] = useState("#e0e7ec");
  const [selectedTab, setSelectedTab] = useState('Attendance'); // New state for tracking selected tab

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  // Get month and year for display
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const attendanceStatuses = [
    { value: 'present', label: 'Present', icon: Check, color: 'text-green-500' },
    { value: 'halfday', label: 'Half Day', icon: Clock, color: 'text-yellow-500' },
    { value: 'absent', label: 'Absent', icon: X, color: 'text-red-500' }
  ];

  // Generate calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add the actual dates
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Navigation handlers
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };



  // Check if a date is today
  const isToday = (date) => {
    return date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const tabs = [
    "Data Input",
    "Attendance",
    "Salary",
    "Tasks"
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          rate: Number(formData.rate)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      setSuccess('Employee created successfully!');
      setFormData({ name: '', rate: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const getAttendanceStatus = (employeeId) => {
    const key = `${selectedDate.toISOString()}-${employeeId}`;
    return attendance[key] || 'absent';
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  const fetchAttendanceData = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`https://your-api.com/attendance?date=${formattedDate}`);
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };


  const markAttendance = async (employeeId, status) => {
    const key = `${selectedDate.toISOString()}-${employeeId}`;
    const newAttendance = { ...attendance, [key]: status };
    setAttendance(newAttendance);

    // Here you would make an API call to save the attendance
    try {
      await fetch('http://localhost:3001/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: employeeId,
          date: selectedDate,
          status: status
        })
      });
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };


  // Render content based on selected tab
  const renderContent = () => {
    switch(selectedTab) {
      case 'Data Input':
        return (
          <AddNewEmployee/>
        );
      case 'Attendance':
        return (
          <div className="p-8 bg-light_hover h-full flex">
            {/* Main Content */}
            <div className="flex-1 ">


              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-10">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5"/>
                </button>

                <h2 className="text-xl font-semibold">
                  {currentMonth} {currentYear}
                </h2>

                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="w-5 h-5"/>
                </button>
              </div>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4 text-sm font-normal">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-x-6 gap-y-2 font-mono text-2xl">
                {getDaysInMonth().map((date, index) => (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`
                aspect-square size-28 p-2 rounded-full flex items-center justify-center
                ${date ? 'cursor-pointer hover:bg-gray-100 transition-all duration-200' : 'bg-transparent border-transparent'}
                ${selectedDate && date && selectedDate.getTime() === date.getTime() ? 'bg-gray-200' : ''}
                ${isToday(date) ? 'border-light border-2' : ''}
              `}
                  >
                    {date && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        <div className="absolute bottom-2 flex gap-1">
                          {employees.map(emp => {
                            const status = getAttendanceStatus(emp.id);
                            const StatusIcon = attendanceStatuses.find(s => s.value === status)?.icon;
                            return status !== 'absent' && (
                              <div key={emp.id} className="size-2 rounded-full">
                                {StatusIcon && <StatusIcon
                                  className={`size-2 ${attendanceStatuses.find(s => s.value === status)?.color}`}/>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}

            <div className="ml-8 w-96 border-l-2 border-light pl-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5"/>
                  <h2 className="text-lg font-medium">Attendance</h2>
                </div>
                <p className="text-sm text-gray-600 text-start">{formatDate(selectedDate)}</p>
              </div>

              {/* Employee List */}
              <div className="space-y-4">
                {employees.map(employee => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border-b border-light"
                  >
                    <span className="text-xl font-mono">{employee.name}</span>
                    <div className="flex gap-2">
                      {attendanceStatuses.map(status => {
                        const isSelected = getAttendanceStatus(employee.id) === status.value;
                        const StatusIcon = status.icon;
                        return (
                          <button
                            key={status.value}
                            onClick={() => markAttendance(employee.id, status.value)}
                            className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ${
                              isSelected ? 'bg-gray-200' : ''
                            }`}
                            title={status.label}
                          >
                            <StatusIcon className={`w-5 h-5 ${status.color}`}/>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      case 'Salary':
        return (
          <div className="p-8 bg-light_hover h-full ">
            <div className="text-xl font-mono  text-start ">{"{ Salary Calculation }"}</div>
          </div>
        );
      case 'Tasks':
        return (
          <div className="p-8 bg-light_hover h-full ">
            <div className="text-xl font-mono  text-start ">{"{ Tasks Management }"}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white">
      <div
        className={`flex-1 m-2 grid ${
          isWalletOpen ? "grid-cols-[1fr_8fr]" : "grid-cols-9"
        } text-dark  text-3xl font-medium transition-all duration-300`}
        style={{backgroundColor: bgColor}}
      >
        {/* sidebar */}
        <div
          className=" bg-accent  col-span-2 h-full w-full transition-all duration-300 flex justify-between flex-col">
          <Link to={"/"}
                className={"flex flex-row align-middle items-center text-light px-6 pt-8 mb-6 hover:text-light_hover transition-all duration-300"}>
            <ArrowLeft className={"size-6 text-light_hover"}/>
            <div className="text-xl font-light px-4">{"Back"}</div>
          </Link>

          {/* Tabs */}
          <div className="flex flex-col gap-2 px-6 py-6">
            <div className="text-3xl">
              {tabs.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTab(item)}
                  className={`flex flex-row w-full text-light align-middle justify-between items-center py-4 transition-all duration-150 ${
                    index !== tabs.length - 1 ? 'border-b border-dark' : ''
                  } ${
                    selectedTab === item
                      ? 'text-light_hover -bold' // Apply different text color and bold for selected tab
                      : 'hover:text-light_hover'
                  }`}
                >
                  <div className="px-2">{item}</div>
                  <div className="flex flex-row text-lg font-normal px-2 items-center">
                    <ArrowRight className="ml-2"/>
                  </div>
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="border-l-2 border-white col-span-7 h-full w-full transition-all duration-300">
          {renderContent()}
        </div>
      </div>

      {/* Footer
      <Footer/>*/}
    </div>
  );
}

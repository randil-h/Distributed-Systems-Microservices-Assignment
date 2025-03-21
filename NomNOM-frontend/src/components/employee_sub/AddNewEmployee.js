import React, {useEffect, useState} from 'react';

export default function AddNewEmployee() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



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



  return (
    <div className="p-8 bg-light_hover h-full ">

      <div className="w-1/2">
        <div>

        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xl">
            <div className="space-y-2">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter employee name"
                className="bg-light block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-dark_hover transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2 items-start flex flex-col">
              <label htmlFor="rate">Hourly Rate</label>
              <input
                id="rate"
                name="rate"
                type="number"
                min="0"
                step="100"
                value={formData.rate}
                onChange={handleChange}
                required
                placeholder="Enter hourly rate"
                className="bg-light block w-full appearance-none text-sm border-0  border-b-2 hover:border-b-dark_hover transition-all duration-200 focus:ring-0 focus:ring-offset-0 bg-transparent ring-sky-400 placeholder:text-gray-400"
              />
            </div>

            <button type="submit" className="w-full">
              Add Employee
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

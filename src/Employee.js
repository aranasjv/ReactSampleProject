import React, { Component } from 'react';
import { variables } from './Variable';
import { Department } from './Department';

export class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            employees: [],
            isLoading: false,
            error: null,
            modalTitle:'',
            EmployeeId:0,
            EmployeeName:'',
            DepartmentName:'',
            DateOfJoining:'',
            PhotoFileName:'',
            PhotoPath:variables.PHOTO_URL
        };
    }

    refreshList = async () => {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await fetch(`${variables.API_URL}Employee`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ employees: data, isLoading: false });
        } catch (error) {
            console.error('Fetch error Employee:', error);
            this.setState({ employees: [], error: error.message, isLoading: false });
        }

        try {
            const response = await fetch(`${variables.API_URL}Department`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ departments: data, isLoading: false });
        } catch (error) {
            console.error('Fetch error Department:', error);
            this.setState({ departments: [], error: error.message, isLoading: false });
        }
    };

    createClick = async () => {
        const { EmployeeId, EmployeeName, DepartmentName, DateOfJoining, PhotoFileName } = this.state;

        try {
            const response = await fetch(`${variables.API_URL}Employee`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employeeId: EmployeeId,
                    employeeName: EmployeeName,
                    department: DepartmentName,
                    dateOfJoining: DateOfJoining,
                    photoFileName: PhotoFileName
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create: ${response.status} - ${errorText}`);
            }

            alert('Employee created successfully!');
            this.refreshList();

            const modal = window.bootstrap.Modal.getInstance(document.getElementById('sampleModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Create error:', error);
            alert('Error creating Employee: ' + error.message);
        }
    };

    editClick = async () => {
        try {
            const { EmployeeId, EmployeeName, DepartmentName, DateOfJoining, PhotoFileName  } = this.state;

            const response = await fetch(`${variables.API_URL}Employee/${EmployeeId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
              body: JSON.stringify({
                    employeeId: EmployeeId,
                    employeeName: EmployeeName,
                    department: DepartmentName, // <- renamed to match backend
                    dateOfJoining: DateOfJoining,
                    photoFileName: PhotoFileName || '' // <- ensure it's a string
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update: ${response.status} - ${errorText}`);
            }

            alert('Employee updated successfully!');
            this.refreshList();

            // ✅ Close modal
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('sampleModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating Employee: ' + error.message);
        }
    };

    deleteClick = async (employeeId) => {
        if (!window.confirm("Are you sure you want to delete this Employee?")) return;

        try {
            const response = await fetch(`${variables.API_URL}Employee/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete: ${response.status} - ${errorText}`);
            }

            alert('Employee deleted successfully!');
            this.refreshList();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting Employee: ' + error.message);
        }
    };

    componentDidMount() {
        this.refreshList();
    }

    changeEmployeeName = (e) =>{
        this.setState({EmployeeName:e.target.value})
    }
    
    changeDepartment = (e) =>{
        this.setState({DepartmentName:e.target.value})
    }

    changeDateOfJoining = (e) =>{
        this.setState({DateOfJoining:e.target.value})
    }

    addClick = () => {
        this.setState({
            modalTitle: "Add Employee",
            EmployeeId: 0,
            EmployeeName:"",
            DepartmentName:'',
            DateOfJoining:'',
            PhotoFileName:''
        });
    }

    updateClick = (emp) => {
        this.setState({
            modalTitle: "Update Employee",
            EmployeeId: emp.employeeId,
            EmployeeName: emp.employeeName,
            DepartmentName: emp.department,
            DateOfJoining: emp.dateOfJoining,
            PhotoFileName: emp.photoFileName
        });
    };

    imageUpload = async (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) {
            alert("No file selected.");
            return;
        }

        const formdata = new FormData();
        formdata.append("file", file);

        try {
            const response = await fetch(`${variables.API_URL}Employee/SaveFile`, {
                method: 'POST',
                body: formdata
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to upload: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            this.setState({ PhotoFileName: data.photoFileName }); // ✅ Extract string


            //alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Image upload error:', error);
            //alert('Error uploading image: ' + error.message);
        }
    }

    render() {
        const { departments, employees, isLoading, error, modalTitle, DepartmentId, EmployeeId, EmployeeName, DepartmentName, DateOfJoining, PhotoFileName, PhotoPath} = this.state;

        return (
            <div>
                <button type='button' className='btn btn-primary m-2 float-end'
                 data-bs-toggle='modal' data-bs-target='#sampleModal'
                 onClick={()=>this.addClick()}>
                        Add Employee
                </button>
                {isLoading && <p>Loading employees...</p>}
                {error && <p className="text-danger">Error: {error}</p>}
                {!isLoading && !error && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Employee Id</th>
                                <th>Employee Name</th>
                                <th>Department Name</th>
                                <th>Date of Joining</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.employeeId}>
                                    <td>{emp.employeeId}</td>
                                    <td>{emp.employeeName}</td>
                                    <td>{emp.department}</td>
                                    <td>{emp.dateOfJoining}</td>
                                    <td>
                                        <button type='button' className='btn btn-primary m-2 float-end' 
                                        data-bs-toggle='modal' data-bs-target='#sampleModal'
                                        onClick={()=>this.updateClick(emp)}>
                                            ✏️
                                        </button>
                                        <button type='button' className='btn btn-primary m-2 float-end' 
                                        onClick={()=>this.deleteClick(emp.employeeId)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="modal fade" id='sampleModal' tabIndex='-1' aria-hidden='true'>
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{modalTitle}</h5>
                                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                            </div>
                            <div className='modal-body'>
                                <div className='d-flex flex-row bd-highlight mb-3'>
                                    <div className='p-2 w-50 bd-highlight'>
                                        <div className='input-group mb-3'>
                                            <span className='input-group-text'>Employee Name</span>
                                            <input type='text' className='form-control' value={EmployeeName} onChange={this.changeEmployeeName}></input>
                                        </div>
                                        <div className='input-group mb-3'>
                                            <span className='input-group-text'>Department</span>
                                            <select className='form-select' onChange={this.changeDepartment} value={DepartmentName}>
                                                {departments.map(dep => <option key={dep.departmentId}>
                                                    {dep.departmentName}
                                                </option>)}
                                            </select>
                                        </div>
                                        <div className='input-group mb-3'>
                                            <span className='input-group-text'>Date of Joining</span>
                                            <input type='date' className='form-control' value={DateOfJoining} onChange={this.changeDateOfJoining}></input>
                                        </div>
                                    </div>
                                     <div className='p-2 w-50 bd-highlight'>
                                        <img width='250px' height='250px' src={PhotoPath + PhotoFileName} alt="Employee" />
                                        <input className='m-2' type='file' onChange={this.imageUpload}/>
                                     </div>
                                </div>
                                {EmployeeId === 0 ?
                                        <button type='button' className='btn btn-primary float-start' onClick={this.createClick}>Create</button> :
                                        <button type='button' className='btn btn-primary float-start' onClick={this.editClick}>Update</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

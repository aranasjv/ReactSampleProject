import React, { Component } from 'react';
import { variables } from './Variable';

export class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            isLoading: false,
            error: null,
            modalTitle:'',
            DepartmentId:0,
            DepartmentName:''
        };
    }

    refreshList = async () => {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await fetch(`${variables.API_URL}Department`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setState({ departments: data, isLoading: false });
        } catch (error) {
            console.error('Fetch error:', error);
            this.setState({ departments: [], error: error.message, isLoading: false });
        }
    };

    createClick = async () => {
        try {
            const response = await fetch(`${variables.API_URL}Department`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    departmentName: this.state.DepartmentName
                })
            });

            if (!response.ok) {
                const errorText = await response.text(); // Optional: extract error detail
                throw new Error(`Failed to create: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            alert('Department created successfully!');
            this.refreshList();
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('sampleModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Create error:', error);
            alert('Error creating department: ' + error.message);
        }
    };

    editClick = async () => {
        try {
            const { DepartmentId, DepartmentName } = this.state;

            const response = await fetch(`${variables.API_URL}Department/${DepartmentId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    departmentId: DepartmentId,
                    departmentName: DepartmentName
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update: ${response.status} - ${errorText}`);
            }

            alert('Department updated successfully!');
            this.refreshList();

            // ✅ Close modal
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('sampleModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating department: ' + error.message);
        }
    };

    deleteClick = async (departmentId) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;

        try {
            const response = await fetch(`${variables.API_URL}Department/${departmentId}`, {
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

            alert('Department deleted successfully!');
            this.refreshList();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting department: ' + error.message);
        }
    };


    componentDidMount() {
        this.refreshList();
    }

    changeDepartment = (e) =>{
        this.setState({DepartmentName:e.target.value})
    }

    addClick = () => {
        this.setState({
            modalTitle: "Add Department",
            DepartmentId: 0,
            DepartmentName: ""
        });
    }

    updateClick = (dep) => {
        this.setState({
            modalTitle: "Update Department",
            DepartmentId: dep.departmentId,
            DepartmentName: dep.departmentName
        });
    }


    render() {
        const { departments, isLoading, error, modalTitle, DepartmentId, DepartmentName } = this.state;

        return (
            <div>
                <button type='button' className='btn btn-primary m-2 float-end'
                 data-bs-toggle='modal' data-bs-target='#sampleModal'
                 onClick={()=>this.addClick()}>
                        Add Department
                </button>
                {isLoading && <p>Loading departments...</p>}
                {error && <p className="text-danger">Error: {error}</p>}
                {!isLoading && !error && (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Department Id</th>
                                <th>Department Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map(dep => (
                                <tr key={dep.departmentId}>
                                    <td>{dep.departmentId}</td>
                                    <td>{dep.departmentName}</td>
                                    <td>
                                        <button type='button' className='btn btn-primary m-2 float-end' 
                                        data-bs-toggle='modal' data-bs-target='#sampleModal'
                                        onClick={()=>this.updateClick(dep)}>
                                            ✏️
                                        </button>
                                        <button type='button' className='btn btn-primary m-2 float-end' 
                                        onClick={()=>this.deleteClick(dep.departmentId)}>
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
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>DepartmentName</span>
                                    <input type='text' className='form-control' value={DepartmentName} onChange={this.changeDepartment}></input>
                                </div>
                                {DepartmentId == 0?<button type='button' className='btn btn-primary float-start' onClick={()=>this.createClick()}>Create</button>:null }
                                {DepartmentId != 0?<button type='button' className='btn btn-primary float-start' onClick={()=>this.editClick()}>Update</button>:null }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

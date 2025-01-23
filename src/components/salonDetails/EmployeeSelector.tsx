import React from "react";
import { Employee } from "../../models/Employee";

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployeeId: number | null;
  onEmployeeSelect: (employeeId: number) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  selectedEmployeeId,
  onEmployeeSelect,
}) => {
  return (
    <div>
      <h3>Select an Employee</h3>
      <select
        value={selectedEmployeeId ?? ""}
        onChange={(e) => onEmployeeSelect(Number(e.target.value))}
      >
        <option value="">Select an employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.employeeId}>
            {employee.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeSelector;

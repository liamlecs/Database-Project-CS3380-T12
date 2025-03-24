import '../SearchBar/Dropdown.css';

interface DropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => (
    <div className="dropdown-field">
        <label>{label}</label>
        <select className="dropdown" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select {label}</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

export default Dropdown;


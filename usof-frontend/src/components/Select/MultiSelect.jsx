
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './MultiSelect.css';

const animatedComponents = makeAnimated();

const MultiSelect = ({options, handleChange, defaultOptions}) => {

    console.log(options);
    
    return (
        <Select
            onChange={handleChange}
            options={options}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
        />
    )
}

export default MultiSelect


import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HeaderTitle from '../../../HeaderTitle';
import MaterialIcons from '../../../ui/MaterialIcons';
import PhotoUploader from '../../../Uploader/PhotoUploader';
import route from '../../../../API/route';
import { useAuth } from '../../../../hooks/useAuth';
import { useModel } from '../../../../hooks/useModel';
import BackButton from '../../../Buttons/BackButton';
import MultiSelect from '../../../Select/MultiSelect';
import { useCategory } from '../../../../hooks/useCategory';
import { usePost } from '../../../../hooks/usePost';
import modelsEnum from '../../../../utils/models-enum';
// import Navbar from './Navbar';

const AdminEditTemplate = ({modelName, id, getById, updateById, formData, setFormData, backLink, headerTitle, formInputs, photoUrl}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('user');
    const auth = useAuth();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const { updatePhotoById } = useModel(modelName);
    const { fetchCategoryData, getCategoryByFullName } = useCategory();
    const { getPostById } = usePost();
    const [options, setOptions] = useState([]);
    const [ postCategories, setPostCategories ] = useState([]);

    // const { id } = useParams();

    const getInfo = async (id) => {
        await getById(id)
        .then((res) => {
            const dataInputs = {}; 

            formInputs.forEach((input) => {
                dataInputs[input.val] = res[input.val]; 
            });

            setFormData(dataInputs);
            setRole(dataInputs['role']);
        }).catch(err => console.log(err));
    }
    
    useEffect(() => {
        getInfo(id);
    }, [location])

    useEffect(() => {
        const getAllCategories = async () => {
            const res = await fetchCategoryData();
            const arr = []
            res.forEach(category => {
                if (category.title != 'Uncategorised') {
                    arr.push({
                        value: category.title,
                        label: category.title
                    })
                    setOptions(arr);
                }
            });
        }
        const getPostCategories = async () => {
            const post = await getPostById(id);
            const arr = [];
            post.post_categories?.filter(item => item != 'Uncategorized').forEach(async (category) => {
                const res = await getCategoryByFullName(category);
                if (res) {
                    arr.push(res);
                    setPostCategories(arr)
                }
            })
        }
        getAllCategories();
        if (modelName == modelsEnum.POSTS) getPostCategories();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataInputs = {
            categories: postCategories
        }; 
        console.log(dataInputs);

        formInputs.forEach((input) => {
            dataInputs[input.val] = formData[input.val]; 
        });

        const jsonData = JSON.stringify(dataInputs);

        const res = await updateById(id, jsonData);

        if (file) {
            await updatePhotoById(id, file);
        }

        if (res) navigate(backLink);
    }

    const handleChooseCategory = async (e) => {
        const arr = [];
        e.forEach(async item => {
            const categoryName = item.value;
            const category = await getCategoryByFullName(categoryName);
            arr.push(category)
            setPostCategories(arr)
        })
    }

    return (
        <section className='admin_create-section'>
        
        <div className='admin_create-head-div'>
                <BackButton backLink={backLink} />
                <HeaderTitle title={headerTitle} />
            </div>
            <div className='admin_create-container'>

                <div className='inputs-section_main default-bg'>
                        {
                            photoUrl && (
                                <PhotoUploader currentImageUrl={photoUrl} image={image} setImage={setImage} setFile={setFile} />
                            )
                        }

                        <div className='inputs-container'>
                        {
                            formInputs.map((inputs, index) => (
                                <div key={index} className='value-container admin_create'>
                                    <label className='input_label'>{inputs.name}</label>
                                    {
                                        inputs.val == 'post_categories' ? (
                                            postCategories?.length > 0 ? (
                                                <div className='admin_edit-categories-cont'>
                                                {

                                                    (postCategories?.map((category) => (
                                                    <div className='admin_edit-categories'>
                                                        {category.title || category}
                                                    </div>
                                                    ))) 
                                                }
                                                </div>
                                            ) : '–'
                                        )
                                        : formData[inputs.val]
                                    }
                                </div>
                            ))
                        }
                        </div>
                </div>
                    
                <form className='form admin_create' onSubmit={handleSubmit}>
                    <div className='inputs_edit-section'>
                        <div className='inputs-container'>
                        {
                            formInputs.map((inputs, index) => {
                                return inputs.isEditable &&
                                <div key={index} className='input-container admin_create'>
                                    <label className='input_label'>New {inputs.name}</label>
                                    
                                    {inputs.name === 'Role' && role === 'admin' ? (
                                        <input type={`${inputs.type}`} id={`${inputs.name}`} className='form-input admin_create' 
                                            name={`${inputs.val}`}
                                            value={formData[inputs.val]}
                                            readOnly />
                                    ) : (
                                        inputs.type === 'select' ? (
                                            <select className='form-input admin_create'
                                                name={`${inputs.val}`}
                                                value={formData[inputs.val]}
                                                onChange={handleChange}>
                                                {
                                                    inputs.options?.map((option, index) => (
                                                        <option key={index}>{option}</option>
                                                    ))
                                                }
                                            </select>
                                        ) : (
                                            inputs.type === 'multiselect' ? (
                                                <div className='multiselect-input_container'>
                                                    <MultiSelect options={options} handleChange={handleChooseCategory} />
                                                </div>
                                            ) : (
                                                <input type={`${inputs.type}`} id={`${inputs.name}`} className='form-input admin_create' 
                                                    name={`${inputs.val}`}
                                                    value={formData[inputs.val]}
                                                    onChange={handleChange}
                                                    required={inputs.isRequired}
                                                    readOnly={!inputs.isEditable} />
                                        ))
                                    )}
                                </div>
                            })
                        }
                        </div>
                    </div>

                    <button type="submit" className='form-button button-yellow' disabled={role == 'admin' && auth.id != id}>Update</button>
                </form>
            </div>
        </section>
    )
}

export default AdminEditTemplate
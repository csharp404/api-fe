import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import "bootstrap/dist/css/bootstrap.min.css";
import ToastMessage from "../GeneralBlock/ToastMsg";
import { useTranslation } from 'react-i18next';

export default function DoctorForm() {
 const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    role:"3"
  
  }); // Initialize as empty object
  const [areas, setAreas] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [toastMessage, setToastMessage] = useState(""); 
  const navigate = useNavigate();

  // Fetch departments and cities on component mount
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/Departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error(t("Error fetching departments:"), error);
      });

    axios
      .get("https://localhost:7127/api/Generic/Cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error(t("Error fetching cities:"), error);
      });
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (formData.cityid) {
      // Fetch areas when city is selected
      axios
        .get(`https://localhost:7127/api/Generic/Areas/${formData.cityid}`)
        .then((response) => {
          setAreas(response.data);
        })
        .catch((error) => {
          console.error(t("Error fetching areas:"), error);
        });
    } else {
      setAreas([]); // Clear areas if no city is selected
    }
  }, [formData.cityid]); // Dependency on cityid to fetch areas when city changes

  useEffect(() => {
    // Fetch doctor data based on the id from URL
    axios
      .get(
        `https://localhost:7127/api/user/user/${id}`
      )
      .then((response) => {
       
        setFormData(response.data.doctorsCard); // Set form data to fetched doctor info
      })
      .catch((error) => {
        console.error(t("Error Loading Staff Data:"), error);
      });
  }, [id]); // Dependency array ensures this effect runs when the id changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    axios
      .put(`https://localhost:7127/api/user/user-update`, formData)
      .then(() => {
        setToastMessage(t("Staff Data Updated Successfully!")); // Trigger toast message on success
        setTimeout(() => setToastMessage(""), 3000); // Clear toast message after 3 seconds
          navigate(`/details-staff/${id}`);
      })
      .catch((error) => {
        console.error(t("Error Updating Staff Data:"), error);
      });
  };

  if (!formData) {
    return <div>{t("Loading...")}</div>; // Render a loading state until the doctor data is fetched
  }

  return (
    <div className="container mt-5 mb-5" style={{ direction }}>
      <div className="row justify-content-center">
        <div className="col-8">
        <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center-title mb-4 text-white bg-primary py-3 rounded-top">
              {t("Edit Management Staff Details")}
            </h2>
            {toastMessage && (
              <ToastMessage message={toastMessage} type={"success"} />
            )}
            <form onSubmit={handleSubmit}>
              {/* First Name and Last Name Fields */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    {t("First Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lastName" className="form-label">
                    {t("Last Name")}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Age Field */}
              <div className="row mb-3">
              <div className="col-md-6">
                  <label htmlFor="age" className="form-label">
                    {t("Age")}
                  </label>
                  <input
  type="number"
  className={`form-control form-control-lg ${formData.age && (formData.age < 22 || formData.age > 64) ? 'is-invalid' : ''}`}
  id="age"
  name="age"
  value={formData.age}
  onChange={handleChange}
  required
  min="22"
  max="64"
/>
{formData.age && (formData.age < 22 || formData.age > 64) && (
  <div className="invalid-feedback">
    {t("Age must be between 22 and 64.")}
  </div>
)}
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    {t("Email")}
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
              </div>

              {/* Hire Date and Department Fields */}
              <div className="row mb-3">
                

              </div>

              {/* Experience and Other Fields */}
              <div className="row mb-3">
              <div className="col-md-6">
                  <label htmlFor="experience" className="form-label">
                    {t("Experience")}
                  </label>
                  <input
  type="number"
  className={`form-control form-control-lg ${formData.experience && (formData.experience < 1 || formData.experience > 32) ? 'is-invalid' : ''}`}
  id="experience"
  name="experience"
  value={formData.experience}
  onChange={handleChange}
  required
  min="1"
  max="32"
/>
{formData.experience && (formData.experience < 1 || formData.experience > 32) && (
  <div className="invalid-feedback">
    {t("Experience must be between 1 and 32")}
  </div>
)}
                </div>

                <div className="col-md-6">
                  <label htmlFor="phonenumber" className="form-label">
                    {t("Phone")}
                  </label>
                  <input
  type="tel"
  className={`form-control form-control-lg ${formData.phonenumber && !/^07\d{8}$/.test(formData.phonenumber) ? 'is-invalid' : ''}`}
  id="phonenumber"
  name="phonenumber"
  value={formData.phonenumber}
  onChange={handleChange}
  required
  pattern="^07\d{8}$"
  title="Phone number must be in the format 07xxxxxxxx"
/>
{formData.phonenumber && !/^07\d{8}$/.test(formData.phonenumber) && (
  <div className="invalid-feedback">
    {t("Phone number must be in the format 07xxxxxxxx.")}
  </div>
)}
                </div>



              </div>

              {/* Phone and Email Fields */}
         

              {/* Gender Fields */}
              <div className="row mb-3">

              <div className="col-md-6">
                  <label htmlFor="departmentid" className="form-label">
                    {t("Department")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="departmentid"
                    name="departmentid"
                    value={formData.departmentid}
                    onChange={handleChange}
                    required
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {t(dept.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
  <label className="form-label" htmlFor="gender">{t("Gender")}</label>
  <select
    className="form-select form-select-lg"
    id="gender"
    name="gender"
    value={formData.gender || ""}
    onChange={handleChange}
  >
    <option value="" disabled>
      {t("Select Gender")}
    </option>
    <option value="0">{t("Male")}</option>
    <option value="1">{t("Female")}</option>
  </select>
</div>
              </div>

              {/* Area and City Fields */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="cityid" className="form-label">
                    {t("City")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="cityid"
                    name="cityid"
                    value={formData.cityid}
                    onChange={handleChange} // Update cities based on this change
                    required
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {t(city.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="areaid" className="form-label">
                    {t("Area")}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="areaid"
                    name="areaid"
                    value={formData.areaid}
                    onChange={handleChange}
                    required
                  >
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {t(area.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Field */}
              <div className="row mb-3">
                <label htmlFor="role" className="form-label">
                  {t("Position")}
                </label>
                <select
                  className="form-select form-select-lg"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled
                >
                 
                  <option value="3">{t("Management Staff")}</option>
                 
                </select>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="major-btn"
                  style={{ padding: "12px 40px", fontSize: "1.1rem" }}
                >
                  {t("Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

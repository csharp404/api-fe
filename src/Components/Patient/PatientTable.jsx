/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { jwtDecode } from "jwt-decode";

export default function PatientList() {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [patients, setPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger re-fetch and re-render
  const [formedit, setFormEdit] = useState({});
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [pcds, setPcds] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://localhost:7127/api/Patient/GetById/${id}`)
        .then((response) => {
          const patient = response.data.patient;
          setFormEdit({ ...patient });

          if (patient.departmentId) fetchPcds(patient.departmentId);
          if (patient.cityId) fetchAreas(patient.cityId);
        })
        .catch((error) => console.error("Error Loading Patient Data", error));
    }
  }, [id]);
  // Fetch Areas based on selected city
  const fetchAreas = (cityId) => {
    axios
      .get(`https://localhost:7127/api/Generic/Areas/${cityId}`)
      .then((response) => setAreas(response.data || []))
      .catch((error) => console.error("Error Loading Areas", error));
  };

  // Handle city change
  const handleCityChangeEdit = (e) => {
    const selectedCityId = e.target.value;
    if (selectedCityId !== formedit.cityId) {
      setFormEdit({
        ...formedit,
        cityId: selectedCityId,
        areaId: "", // Reset area when city changes
      });
      setAreas([]); // Clear areas while fetching
      fetchAreas(selectedCityId);
    }
  };
  const handleEditSubmitEdit = () => {
    // Send the updated data to the server

    formedit.gender = formedit.gender == "true";
    axios
      .put(`https://localhost:7127/api/Patient/Update/${id}`, formedit)
      .then((response) => {
        // Handle success
        console.log("Patient data updated successfully:", response.data);
        // You can add additional success handling here, like closing the modal or showing a success message.
        setShowEditModal(false); // Close modal after submission (optional)

        setRefreshKey(true);
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating patient data:", error);
        // You can show an error message or handle it appropriately.
      });
  };
  // Handle department change
  const handleDepartmentChangeEdit = (e) => {
    const selectedDepartmentId = e.target.value;
    if (selectedDepartmentId !== formedit.departmentId) {
      setFormEdit({
        ...formedit,
        departmentId: selectedDepartmentId,
        pcd: "", // Reset PCD when department changes
      });
      setPcds([]); // Clear PCDs while fetching
      fetchPcds(selectedDepartmentId);
    }
  };

  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setFormEdit({ ...formedit, [name]: value });
  };
  // Fetch PCDs based on selected department
  const fetchPcds = (departmentId) => {
    axios
      .get(`https://localhost:7127/api/User/user/1/${departmentId}`)
      .then((response) => setPcds(response.data.doctorsCard || []))
      .catch((error) => console.error("Error Loading PCDs", error));
  };
  useEffect(() => {
    axios
      .get("https://localhost:7127/api/Generic/Departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => console.error("Error Loading Departments", error));

    axios
      .get("https://localhost:7127/api/Generic/Cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => console.error("Error Loading Cities", error));
  }, []);

  // Separate state for each search box
  const [searchId, setSearchId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");

  let token;
  const tokenn = localStorage.getItem("token");
  if (!tokenn) return null;

  try {
    const x = jwtDecode(tokenn);
    token = x.role;
    console.log(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("https://localhost:7127/api/Patient/Get");
        const data = await response.json();
        console.log(data.patients);
        setPatients(data.patients || []);
        setRefreshKey(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatients();
  }, [refreshKey]); // Re-fetch patients whenever refreshKey changes

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `https://localhost:7127/api/Patient/Delete/${selectedItem.id}`
      );
      if (response.status === 200) {
        setPatients(
          patients.filter((patient) => patient.id !== selectedItem.id)
        );
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Filter logic based on all search fields
  const filteredPatients = patients.filter((patient) => {
    console.log(patient);
    console.log(searchId);

    const matchesId = searchId
      ? patient.code.toLowerCase().includes(searchId)
      : true;
    const matchesPhone = searchPhone
      ? patient.phoneNumber.toLowerCase().includes(searchPhone.toLowerCase())
      : true;
    const matchesName = searchName
      ? patient.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchesId && matchesPhone && matchesName;
  });

  return (
    <div style={{ direction }}>
      <>
        <div className="filter-container d-flex flex-row gap-3">
          <input
            type="text"
            className="form-filter"
            placeholder={t("Search by ID")}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            aria-label="Search by ID"
          />
          <input
            type="text"
            className="form-filter"
            placeholder={t("Search by Phone")}
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            aria-label="Search by Phone"
          />
          <input
            type="text"
            className="form-filter"
            placeholder={t("Search by Name")}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            aria-label="Search by Name"
          />
        </div>

        <table
          className="table table-hover "
          style={{ maxWidth: "85%", margin: "auto" }}
        >
          <thead>
            <tr className="table-primary">
              <th scope="col">{t("Id")}</th>

              <th scope="col">{t("Name")}</th>
              <th scope="col">{t("Admission Date")}</th>
              <th scope="col">{t("Department")}</th>
              <th scope="col">{t("PCD")}</th>
              <th scope="col">{t("Age")}</th>
              <th scope="col">{t("Phone")}</th>
              <th scope="col">{t("Gender")}</th>
              <th scope="col">{t("Address")}</th>
              <th scope="col">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="table-light"
                style={{ cursor: "pointer" }}
              >
                <td>{patient.code}</td>

                <td>{patient.name}</td>
                <td>{new Date(patient.admissionDate).toLocaleString()}</td>
                <td>{t(patient.department)}</td>
                <td>{patient.pcd}</td>
                <td>{patient.age}</td>
                <td>{patient.phoneNumber}</td>
                <td>{patient.gender === "Male" ? t("Male") : t("Female")}</td>
                <td>
                  {t(patient.cityName)} ,{t(patient.areaName)}
                </td>
                <td>
                  <div className="dropdown">
                    <button
                      className="action-btn"
                      type="button"
                      id={`dropdownMenuButton-${patient.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby={`dropdownMenuButton-${patient.id}`}
                    >
                      {(token == "ManagementStaff" || token == "Admin") && (
                        <li>
                          <button
                            className="dropdown-item pt-text-danger"
                            onClick={() => handleDeleteClick(patient)}
                          >
                            {t("Delete Patient Record")}
                          </button>
                        </li>
                      )}
                      {(token == "ManagementStaff" || token == "Admin") && (
                        <li>
                          <button
                            className="dropdown-item pt-text-info"
                            onClick={() => {
                              setId(patient.id);
                              setShowEditModal(true);
                            }}
                          >
                            {t("Edit")}
                          </button>
                        </li>
                      )}
                      {(token == "Nurse" || token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/create-vital-signs/${patient.id}`}
                          >
                            {t("Issue Vital Signs")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Pharmacist" ||
                        token == "Nurse" ||
                        token == "Admin") && (
                        <li className="history-vital-signs-li">
                          <NavLink
                            className="dropdown-item"
                            to={`/history-vital-signs/${patient.id}`}
                          >
                            {t("Vital Signs History")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "Doctor" || token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/create-prescription/${patient.id}`}
                          >
                            {t("Issue Prescription")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Pharmacist" ||
                        token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/prescription/${patient.id}`}
                          >
                            {t("Display Prescription")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Pharmacist" ||
                        token == "Admin") && (
                        <li className="prescription-history">
                          <NavLink
                            className="dropdown-item"
                            to={`/all-prescription/${patient.id}`}
                          >
                            {t("Prescription History")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "Doctor" || token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/create-diagnosis/${patient.id}`}
                          >
                            {t("Issue Diagnosis")}
                          </NavLink>
                        </li>
                      )}
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/diagnosis/${patient.id}`}
                        >
                          {t("Display Diagnosis")}
                        </NavLink>
                      </li>
                      <li className="diagnosis-history">
                        <NavLink
                          className="dropdown-item"
                          to={`/all-diagnosis/${patient.id}`}
                        >
                          {t("Diagnosis History")}
                        </NavLink>
                      </li>

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/create-sick-leave/${patient.id}`}
                          >
                            {t("Issue Sick Leave")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/sick-leave/${patient.id}`}
                          >
                            {t("Display Sick Leave")}
                          </NavLink>
                        </li>
                      )}

                      {(token == "ManagementStaff" ||
                        token == "Doctor" ||
                        token == "Admin") && (
                        <li>
                          <NavLink
                            className="dropdown-item"
                            to={`/all-sick-leaves/${patient.id}`}
                          >
                            {t("Sick Leave History")}
                          </NavLink>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Delete Modal */}
        {showEditModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Edit Information")}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditSubmitEdit();
                    }}
                  >
                    <div className="mb-3">
                      <label htmlFor="firstname" className="form-label">
                        {t("First Name")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstname"
                        name="firstName"
                        value={formedit.firstName || ""}
                        onChange={handleInputChangeEdit}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="lastname" className="form-label">
                        {t("Last Name")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        name="lastName"
                        value={formedit.lastName || ""}
                        onChange={handleInputChangeEdit}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="department" className="form-label">
                        {t("Department")}
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="department"
                        name="departmentId"
                        value={formedit.departmentId || ""}
                        onChange={handleDepartmentChangeEdit}
                      >
                        <option value="">{t("Select Department")}</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {t(dept.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="pcd" className="form-label">
                        {t("PCD")}
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="pcd"
                        name="pcd"
                        value={formedit.pcd || ""}
                        onChange={handleInputChangeEdit}
                      >
                        <option value="">{t("Select PCD")}</option>
                        {pcds.map((pcd) => (
                          <option key={pcd.id} value={pcd.id}>
                            {pcd.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="city" className="form-label">
                        {t("City")}
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="city"
                        name="cityId"
                        value={formedit.cityId || ""}
                        onChange={handleCityChangeEdit}
                      >
                        <option value="">{t("Select City")}</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {t(city.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="area" className="form-label">
                        {t("Area")}
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="area"
                        name="areaId"
                        value={formedit.areaId || ""}
                        onChange={handleInputChangeEdit}
                      >
                        <option value="">{t("Select Area")}</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {t(area.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label">
                        {t("Phone")}
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${
                          formedit.phoneNumber &&
                          !/^07\d{8}$/.test(formedit.phoneNumber)
                            ? "is-invalid"
                            : ""
                        }`}
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formedit.phoneNumber || ""}
                        onChange={handleInputChangeEdit}
                        onBlur={() => {
                          if (
                            formedit.phoneNumber &&
                            !/^07\d{8}$/.test(formedit.phoneNumber)
                          ) {
                            // eslint-disable-next-line no-undef
                            setError(
                              t(
                                "Phone number must be in the format 07xxxxxxxx."
                              )
                            );
                          } else {
                            setError("");
                          }
                        }}
                        required
                        pattern="^07\d{8}$"
                        title={t(
                          "Phone number must be in the format 07xxxxxxxx."
                        )}
                      />
                      {formedit.phoneNumber &&
                        !/^07\d{8}$/.test(formedit.phoneNumber) && (
                          <div className="invalid-feedback">
                            {t(
                              "Phone number must be in the format 07xxxxxxxx."
                            )}
                          </div>
                        )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="gender">
                        {t("Gender")}
                      </label>
                      <select
                        className="form-select form-select-lg"
                        id="gender"
                        name="gender"
                        value={formedit.gender || ""}
                        onChange={handleInputChangeEdit}
                      >
                        <option value="" disabled>
                          {t("Select Gender")}
                        </option>
                        <option value="1">{t("Male")}</option>
                        <option value="2">{t("Female")}</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      onClick={handleEditSubmitEdit}
                      className="major-btn mt-3"
                    >
                      {t("Save Changes")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("CONFIRM DELETION")}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleDeleteCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  {t("Are You Sure You Want To Delete This Record?")}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleDeleteCancel}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="button"
                    className="confirm-btn"
                    onClick={handleDeleteConfirm}
                  >
                    {t("Confirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

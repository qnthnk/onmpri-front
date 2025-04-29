import React from 'react'
import { FaInfo } from "react-icons/fa";
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const Complaint = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    const [complaintData, setComplaintData] = useState({
        cause: '',
        url_image_complaint: 'none',
        complaint_comment: '',
        status: 'new',
        latitude: '',
        longitude: '',
        user_id: localStorage.getItem("id") || ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaintData({
            ...complaintData,
            [name]: value
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToCloudinary = async (base64Image) => {
        const data = new FormData();
        data.append("file", base64Image);
        data.append("upload_preset", "complaint_upload");
        data.append("cloud_name", "dtxgs0qsc");

        const response = await fetch("https://api.cloudinary.com/v1_1/dtxgs0qsc/image/upload", {
            method: "POST",
            body: data,
        });

        const result = await response.json();
        return result.secure_url;
    };



    const validateForm = () => {
        const errors = {};

        if (!complaintData.cause.trim()) {
            errors.cause = "El motivo es obligatorio.";
        }

        if (!complaintData.complaint_comment.trim()) {
            errors.complaint_comment = "El comentario es obligatorio.";
        }

        if (!image) {
            errors.image = "Debe subir una imagen.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        const complaintToSend = {
            ...complaintData,
            // url_image_complaint: image || "none"
        };

        if (!validateForm()) {
            Swal.fire("Por favor complete los campos faltantes. Para continuar, revise su solicitud");
            console.log("Errores en el formulario:", errors);
            return;
        }

        try {
            const imageUrl = await uploadImageToCloudinary(image);

            const complaintToSend = {
                ...complaintData,
                url_image_complaint: imageUrl
            };

            await actions.complaint(complaintToSend);
            console.log("Formulario enviado:", complaintToSend);
            Swal.fire("Denuncia enviada con éxito.");
            navigate('/home');
        } catch (error) {
            console.log("Error en el registro:", error);
            Swal.fire("Hubo un error en el registro. Por favor, inténtalo de nuevo.");
        }
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setErrors((prev) => ({ ...prev, geolocation: "La geolocalización no es soportada por este navegador." }));
            return;
        }

        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setComplaintData((prevData) => ({
                        ...prevData,
                        latitude: latitude.toString(),
                        longitude: longitude.toString()
                    }));
                },
                (error) => {
                    setErrors((prev) => ({ ...prev, geolocation: "Error al obtener la ubicación: " + error.message }));
                }
            );
        };

        getLocation();
    }, []);

    return (
        <div className='containerRMCs'>
        <div className='containerHs'>
          <div className='heroContact'>
            <form className="formContact">
              <h2 className='heading'>Denuncia Ciudadana</h2>
              <div style={{ overflowY: "auto", overflowX:"hidden", maxHeight: "50vh", width:"auto",  textAlign: "center" }}>
                        <div style={{ marginBottom: "20px" }}>
                            <select
                                id="cause"
                                name="cause"
                                className='inputContacts'
                                value={complaintData.cause}
                                onChange={handleChange}
                                style={{ width: "55vw", borderRadius: "20px", padding: "10px",display: "flex", justifyContent: "center" }}
                            >
                                <option value="">Seleccione el motivo de la denuncia</option>
                                <option value="Bache">Bache</option>
                                <option value="Vecino ruidoso">Vecino ruidoso</option>
                                <option value="Maltrato animal">Maltrato animal</option>
                                <option value="Alumbrado público">Alumbrado público</option>
                                <option value="Fuga de agua">Fuga de agua</option>
                                <option value="Recolección de basura">Recolección de basura</option>
                                <option value="Acto de corrupción">Acto de corrupción</option>
                                <option value="Otros">Otros</option>

                            </select>
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <textarea
                                id="complaint_comment"
                                name="complaint_comment"
                                className='inputContacts'
                                placeholder='Detalles de la denuncia'
                                value={complaintData.complaint_comment}
                                onChange={handleChange}
                                style={{ width: "55vw", height:"20vh", borderRadius: "20px", padding: "10px",display: "flex", justifyContent: "center" }}

                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <input  type="file" accept="image/*" capture="camera" onChange={handleImageUpload} />
                            <div style={{ marginTop: "20px" }}>
                                {image ? (
                                    <img src={image}
                                        alt="Uploaded"
                                        style={{width:"45vw" ,borderRadius:"20px"}}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "300px",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#f9f9f9"
                                        }}
                                    >
                                        <span style={{ color: "#aaa" }}>Toma una foto desde tu celular</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}} onClick={handleSubmit}>Enviar</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Complaint;

import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import { createLogEntry } from './api';

const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // Get location data from props
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error) {
            console.log(error);
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>New Travel Log!</h2>
            <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
                { error ? <h3 className="error">{error}</h3> : null}
                <label htmlFor="title">Title</label>
                <input name="title" required ref={register}/>
                <label htmlFor="comments">Comments</label>
                <textarea name="comments" rows={3} ref={register}></textarea>
                <label htmlFor="description">Description</label>
                <textarea name="description" rows={3} ref={register}></textarea>
                <label htmlFor="image">Image</label>
                <input name="image"/>
                <label htmlFor="visitDate">Visit Date</label>
                <input name="visitDate" type="date" required ref={register}></input>
                <button disabled={loading}>{loading ? 'Loading...' : 'Create Pin'}</button>
            </form>
        </div>
    )
}

export default LogEntryForm;
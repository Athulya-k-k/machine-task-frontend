import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmailScheduler() {
  const [formData, setFormData] = useState({
    recipients: '', // changed from recipient to recipients (comma-separated string)
    subject: '',
    body: '',
    scheduled_time: '',
  });
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null); // track editing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated string → array for backend
      const payload = {
        ...formData,
        recipients: formData.recipients
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email), // remove empty entries
      };

      if (editId) {
        await axios.put(`https://51.20.117.87.sslip.io/emails/schedule/${editId}/`, payload);
        setMessage('✅ Email updated successfully!');
        setEditId(null);
      } else {
        await axios.post('https://51.20.117.87.sslip.io/emails/schedule/', payload);
        setMessage('✅ Email scheduled successfully!');
      }

      setFormData({
        recipients: '',
        subject: '',
        body: '',
        scheduled_time: '',
      });
      fetchScheduledEmails();
    } catch (err) {
      setMessage('❌ Error saving email.');
      console.error(err);
    }
  };

  const fetchScheduledEmails = async () => {
    try {
      const res = await axios.get('https://51.20.117.87.sslip.io/emails/schedule/all/');
      setEmails(res.data);
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  };

  const handleEdit = (email) => {
    setFormData({
      recipients: Array.isArray(email.recipients)
        ? email.recipients.join(', ')
        : email.recipient, // fallback for old data
      subject: email.subject,
      body: email.body,
      scheduled_time: email.scheduled_time.slice(0, 16),
    });
    setEditId(email.id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheduled email?')) {
      try {
        await axios.delete(`https://51.20.117.87.sslip.io/emails/schedule/${id}/`);
        setMessage('🗑 Email deleted successfully.');
        fetchScheduledEmails();
      } catch (err) {
        setMessage('❌ Error deleting email.');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchScheduledEmails();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        📅 {editId ? 'Edit Scheduled Email' : 'Schedule an Email'}
      </h2>

      {message && <p className="mb-4 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          type="text" // changed from email to text
          name="recipients"
          placeholder="Recipient Emails (comma-separated)"
          value={formData.recipients}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="body"
          placeholder="Email Body"
          value={formData.body}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
        <input
          type="datetime-local"
          name="scheduled_time"
          value={formData.scheduled_time}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className={`${
            editId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded w-full`}
        >
          {editId ? 'Update Email' : 'Schedule Email'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                recipients: '',
                subject: '',
                body: '',
                scheduled_time: '',
              });
              setEditId(null);
              setMessage('');
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded w-full mt-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">📌 Scheduled Emails</h3>
      {emails.length === 0 ? (
        <p className="text-gray-500">No scheduled emails yet.</p>
      ) : (
        emails.map((email) => (
          <div key={email.id} className="p-3 border-b bg-gray-50 rounded mb-2">
            <p>
              <strong>To:</strong>{' '}
              {Array.isArray(email.recipients)
                ? email.recipients.join(', ')
                : email.recipient}
            </p>
            <p><strong>Subject:</strong> {email.subject}</p>
            <p><strong>Scheduled:</strong> {new Date(email.scheduled_time).toLocaleString('en-IN')}</p>
            <p>
              <strong>Status:</strong>{' '}
              {email.is_sent ? (
                <span className="text-green-600 font-semibold">✅ Sent</span>
              ) : (
                <span className="text-orange-600 font-semibold">⏳ Pending</span>
              )}
            </p>
            <div className="mt-2 flex gap-2">
              {!email.is_sent && (
                <button
                  onClick={() => handleEdit(email)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(email.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EmailScheduler;

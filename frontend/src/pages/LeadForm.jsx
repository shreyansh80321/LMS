import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  source: "website",
  status: "new",
  score: 0,
  lead_value: 0,
  is_qualified: false,
};

export default function LeadForm() {
  const { id } = useParams();
  const [lead, setLead] = useState(empty);
  const nav = useNavigate();

  useEffect(() => {
    if (id) {
      API.get(`/leads/${id}`)
        .then((r) => setLead(r.data))
        .catch(() => {});
    }
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    try {
      if (id) await API.put(`/leads/${id}`, lead);
      else await API.post("/leads", lead);
      nav("/leads");
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-50 via-indigo-50 to-blue-50 p-6 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-3xl bg-white backdrop-blur-sm bg-opacity-80 border border-gray-200 shadow-2xl rounded-3xl p-10 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          {id ? "Edit Lead" : "Create New Lead"}
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: "First Name", key: "first_name", placeholder: "John" },
            { label: "Last Name", key: "last_name", placeholder: "Doe" },
            {
              label: "Email",
              key: "email",
              placeholder: "john@example.com",
              type: "email",
              colSpan: 2,
            },
            { label: "Phone", key: "phone", placeholder: "+1 234 567 890" },
            { label: "Company", key: "company", placeholder: "Company Inc." },
            { label: "City", key: "city", placeholder: "New York" },
            { label: "State", key: "state", placeholder: "NY" },
          ].map((field) => (
            <div
              key={field.key}
              className={field.colSpan === 2 ? "md:col-span-2" : ""}
            >
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={lead[field.key]}
                onChange={(e) =>
                  setLead({ ...lead, [field.key]: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none transition shadow-sm"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Source
            </label>
            <select
              value={lead.source}
              onChange={(e) => setLead({ ...lead, source: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none transition shadow-sm bg-white"
            >
              <option value="website">Website</option>
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="referral">Referral</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={lead.status}
              onChange={(e) => setLead({ ...lead, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none transition shadow-sm bg-white"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
              <option value="won">Won</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Score
            </label>
            <input
              type="number"
              value={lead.score}
              onChange={(e) =>
                setLead({ ...lead, score: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Lead Value
            </label>
            <input
              type="number"
              value={lead.lead_value}
              onChange={(e) =>
                setLead({ ...lead, lead_value: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none transition shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4">
          <input
            type="checkbox"
            id="qualified"
            checked={lead.is_qualified}
            onChange={(e) =>
              setLead({ ...lead, is_qualified: e.target.checked })
            }
            className="h-5 w-5 text-blue-600 rounded transition"
          />
          <label htmlFor="qualified" className="text-gray-700 font-medium">
            Mark as Qualified
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-5">
          <button
            type="button"
            onClick={() => nav("/leads")}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.03] shadow-lg transition transform"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

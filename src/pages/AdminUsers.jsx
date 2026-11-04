import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsers({ onViewOrders }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      try {
        setError("");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.msg || "Could not load users.");
        if (!cancelled) setUsers(body.data || []);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Could not connect to the API.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadUsers();
    return () => { cancelled = true; };
  }, [token]);

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.username} and their order history? This cannot be undone.`)) return;
    setDeletingId(user.id);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.msg || "Could not delete the user.");
      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete the user.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRoleChange(user, role) {
    if (role === user.role) return;
    setUpdatingRoleId(user.id);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.msg || "Could not update the user's role.");
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...body.data } : item));
    } catch (updateError) {
      setError(updateError.message || "Could not update the user's role.");
    } finally {
      setUpdatingRoleId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#646464]">{users.length} {users.length === 1 ? "user" : "users"} registered</p>
      </div>
      {error && <p role="alert" className="mb-5 rounded-xl border border-[#fecdca] bg-white px-5 py-4 text-sm text-[#b42318]">{error}</p>}
      {isLoading ? <p className="py-12 text-center text-sm text-[#646464]">Loading users...</p> : users.length === 0 ? (
        <p className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center text-sm text-[#646464]">No users yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] bg-white shadow-[0_0_20px_rgba(0,0,0,0.04)]">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-[#e8e8e8] bg-[#f8f9fb] text-[10px] font-bold uppercase tracking-wide text-[#848484]"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#e8e8e8]">{users.map((user) => <tr key={user.id}>
              <td className="px-4 py-4"><p className="font-bold text-[#00071b]">{user.username}</p><p className="text-[10px] text-[#848484]">#{user.id}</p></td>
              <td className="px-4 py-4 text-[#646464]">{user.email}</td>
              <td className="px-4 py-4">
                <select 
                  aria-label={`Role for ${user.username}`}
                  value={user.role || "user"}
                  disabled={updatingRoleId === user.id}
                  onChange={(event) => handleRoleChange(user, event.target.value)}
                  className="rounded-md border border-[#d0d5dd] bg-white px-2 py-1.5 text-xs font-semibold text-[#272727] disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {updatingRoleId === user.id && <span className="ml-2 text-xs text-[#646464]">Saving...</span>}
              </td>
              <td className="px-4 py-4 text-[#646464]">{formatDate(user.created_at || user.createdAt)}</td>
              <td className="px-4 py-4"><div className="flex items-center gap-3">
                <button type="button" onClick={() => onViewOrders(user)} className="text-xs font-bold text-blue-950 underline underline-offset-2">View orders</button>
                <button type="button" onClick={() => handleDelete(user)} disabled={deletingId !== null} className="text-xs font-bold text-[#b42318] underline underline-offset-2 disabled:opacity-50">{deletingId === user.id ? "Deleting..." : "Delete"}</button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { adminFetch, fmtDate } from "@/components/admin/adminFetch";
import {
  Btn,
  DataTable,
  Loading,
  PageHeader,
  Td,
  Tr,
} from "@/components/admin/DataTable";
import type { User } from "@/server/db";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await adminFetch<{ users: User[] }>("/api/admin/users");
    if (res.ok) setUsers(res.data.users);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title="İstifadəçilər"
        subtitle={`${users.length} qeydiyyatlı istifadəçi`}
        actions={
          <Btn
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Yenilə
          </Btn>
        }
      />

      <DataTable
        headers={["Telefon", "Ad", "Yaradılma", "ID"]}
        empty={users.length === 0 ? "İstifadəçi yoxdur" : undefined}
      >
        {users.map((u) => (
          <Tr key={u.id}>
            <Td style={{ fontWeight: 600 }}>{u.phone}</Td>
            <Td>{u.name || "—"}</Td>
            <Td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
              {fmtDate(u.createdAt)}
            </Td>
            <Td style={{ fontSize: 11, color: "#8b93a7", fontFamily: "monospace" }}>
              {u.id}
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}

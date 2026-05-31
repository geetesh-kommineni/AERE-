import { getDb } from "@/lib/db";

export default async function AdminOrders() {
  const db = getDb();
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "2rem",
            fontWeight: 300,
            color: "var(--ink)",
          }}
        >
          Orders
        </h2>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          border: "1px solid rgba(158,139,124,.2)",
        }}
      >
        <thead>
          <tr
            style={{
              background: "var(--ivory)",
              borderBottom: "1px solid rgba(158,139,124,.2)",
              textAlign: "left",
            }}
          >
            <th
              style={{
                padding: "1rem",
                fontSize: ".7rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--taupe)",
                fontWeight: 400,
              }}
            >
              Order ID
            </th>
            <th
              style={{
                padding: "1rem",
                fontSize: ".7rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--taupe)",
                fontWeight: 400,
              }}
            >
              Date
            </th>
            <th
              style={{
                padding: "1rem",
                fontSize: ".7rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--taupe)",
                fontWeight: 400,
              }}
            >
              Customer
            </th>
            <th
              style={{
                padding: "1rem",
                fontSize: ".7rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--taupe)",
                fontWeight: 400,
              }}
            >
              Total
            </th>
            <th
              style={{
                padding: "1rem",
                fontSize: ".7rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--taupe)",
                fontWeight: 400,
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--taupe)",
                  fontStyle: "italic",
                }}
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              let shipping = {};
              try {
                shipping = JSON.parse(o.shipping_address || "{}");
              } catch (e) {
                shipping = { name: o.shipping_address || "N/A" };
              }
              const displayId =
                String(o.id).length > 8
                  ? `#${String(o.id).substring(0, 8)}...`
                  : `#${o.id}`;
              const customerName = o.shipping_name || shipping.name || "N/A";
              const customerEmail = o.shipping_email || o.user_email || "N/A";
              return (
                <tr
                  key={o.id}
                  style={{ borderBottom: "1px solid rgba(158,139,124,.1)" }}
                >
                  <td
                    style={{
                      padding: "1rem",
                      fontFamily: "monospace",
                      fontSize: ".85rem",
                      color: "var(--stone)",
                    }}
                  >
                    {displayId}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontSize: ".85rem",
                      color: "var(--stone)",
                    }}
                  >
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontSize: ".85rem",
                      color: "var(--ink)",
                    }}
                  >
                    {customerName}
                    <br />
                    <span style={{ color: "var(--taupe)", fontSize: ".75rem" }}>
                      {customerEmail}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontFamily: "var(--serif)",
                      fontSize: "1.1rem",
                      color: "var(--ink)",
                    }}
                  >
                    ₹{o.total.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        fontSize: ".65rem",
                        padding: ".2rem .6rem",
                        background: "rgba(212,154,154,.1)",
                        color: "var(--rose)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

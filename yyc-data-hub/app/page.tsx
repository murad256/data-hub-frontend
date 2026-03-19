"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, orgs: 0 });
  const [view, setView] = useState("home");

  useEffect(() => {
    fetchDatasets("");
    fetchStats();
  }, []);

const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
}

async function fetchDatasets(query = "") {
  setLoading(true);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CKAN_URL}/api/3/action/package_search?q=${query}&rows=12`,
    { headers: NGROK_HEADERS }
  );
  const data = await res.json();
  setDatasets(data.result.results);
  setLoading(false);
}

async function fetchStats() {
  const [pkgRes, orgRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_CKAN_URL}/api/3/action/package_search?rows=0`, 
      { headers: NGROK_HEADERS }),
    fetch(`${process.env.NEXT_PUBLIC_CKAN_URL}/api/3/action/organization_list`, 
      { headers: NGROK_HEADERS }),
  ]);
  const pkgData = await pkgRes.json();
  const orgData = await orgRes.json();
  setStats({
    total: pkgData.result.count,
    orgs: orgData.result.length,
  });
}

  function handleSearch(e) {
    e.preventDefault();
    setView("datasets");
    fetchDatasets(search);
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#F4F6F7", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#1B3A5C", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ cursor: "pointer" }} onClick={() => setView("home")}>
          <span style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "18px", letterSpacing: "1px" }}>
            YYC DATA SOCIETY
          </span>
          <span style={{ color: "#AED6F1", fontSize: "14px", marginLeft: "12px" }}>
            | Community Data Hub
          </span>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button
            onClick={() => setView("datasets")}
            style={{ background: "none", border: "none", color: "#AED6F1", fontSize: "14px", cursor: "pointer" }}
          >
            Datasets
          </button>
          <button
            onClick={() => setView("about")}
            style={{ background: "none", border: "none", color: "#AED6F1", fontSize: "14px", cursor: "pointer" }}
          >
            About
          </button>
        </div>
      </nav>

      {/* ── HOME VIEW ─────────────────────────────────────────────────── */}
      {view === "home" && (
        <div>

          {/* HERO */}
          <div style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #2471A3 100%)", padding: "100px 40px", textAlign: "center" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ display: "inline-block", background: "#1A8A6D", color: "#FFFFFF", fontSize: "12px", fontWeight: "bold", padding: "4px 14px", borderRadius: "20px", marginBottom: "24px", letterSpacing: "1px" }}>
                CALGARY · OPEN DATA · COMMUNITY TEST PAGE
              </div>
              <h1 style={{ color: "#FFFFFF", fontSize: "44px", fontWeight: "bold", margin: "0 0 16px 0", lineHeight: "1.2" }}>
                Calgary's Community Data Hub
              </h1>
              <p style={{ color: "#D6EAF8", fontSize: "18px", margin: "0 0 40px 0", lineHeight: "1.7" }}>
                Discover and download open datasets from non-profits, government bodies, and research institutions across Calgary — all in one place.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: "440px", padding: "16px 20px", fontSize: "15px", border: "none", borderRadius: "6px 0 0 6px", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ background: "#1A8A6D", color: "#FFFFFF", border: "none", padding: "16px 28px", fontSize: "15px", fontWeight: "bold", borderRadius: "0 6px 6px 0", cursor: "pointer" }}
                >
                  Search
                </button>
              </form>

              <button
                onClick={() => setView("datasets")}
                style={{ background: "none", border: "2px solid #AED6F1", color: "#AED6F1", padding: "12px 32px", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: "bold" }}
              >
                Browse All Datasets →
              </button>
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{ background: "#1B3A5C", padding: "20px 40px", display: "flex", justifyContent: "center", gap: "80px" }}>
            {[
              { value: stats.total || "—", label: "Published Datasets" },
              { value: stats.orgs || "—", label: "Contributing Organizations" },
              { value: "CC BY 4.0", label: "Open License" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: "bold" }}>{stat.value}</div>
                <div style={{ color: "#AED6F1", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* HOW IT WORKS */}
          <div style={{ background: "#FFFFFF", padding: "80px 40px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ color: "#1B3A5C", fontSize: "28px", fontWeight: "bold", margin: "0 0 12px 0" }}>
                How It Works
              </h2>
              <p style={{ color: "#7F8C8D", fontSize: "15px", margin: "0 0 56px 0" }}>
                From raw data to public insight — in three steps.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
                {[
                  { step: "01", title: "Organizations Contribute", desc: "Non-profits, government bodies, and research institutions share their datasets with YYC Data Society under a Data Sharing Agreement.", color: "#2471A3" },
                  { step: "02", title: "We Clean & Process", desc: "Our team validates, cleans, and standardizes every dataset using our data pipeline — ensuring quality before anything is published.", color: "#1A8A6D" },
                  { step: "03", title: "You Access & Use", desc: "Datasets are published openly on this portal. Search, preview, and download them for research, analysis, or community projects.", color: "#E67E22" },
                ].map(item => (
                  <div key={item.step} style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "36px", fontWeight: "bold", color: item.color, marginBottom: "16px", fontFamily: "Georgia" }}>
                      {item.step}
                    </div>
                    <h3 style={{ color: "#1B3A5C", fontSize: "17px", fontWeight: "bold", margin: "0 0 10px 0" }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "#4A4A4A", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURED DATASETS */}
          <div style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h2 style={{ color: "#1B3A5C", fontSize: "24px", fontWeight: "bold", margin: "0 0 6px 0" }}>
                  Featured Datasets
                </h2>
                <p style={{ color: "#7F8C8D", fontSize: "14px", margin: 0 }}>
                  Recently added to the hub
                </p>
              </div>
              <button
                onClick={() => setView("datasets")}
                style={{ background: "#2471A3", color: "#FFFFFF", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#7F8C8D" }}>Loading...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {datasets.slice(0, 3).map(dataset => (
                  <DatasetCard key={dataset.id} dataset={dataset} router={router} />
                ))}
              </div>
            )}
          </div>

          {/* CTA BANNER */}
          <div style={{ background: "#1A8A6D", padding: "60px 40px", textAlign: "center" }}>
            <h2 style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: "bold", margin: "0 0 12px 0" }}>
              Does your organization have data to share?
            </h2>
            <p style={{ color: "#D1F2EB", fontSize: "15px", margin: "0 0 28px 0" }}>
              Join Calgary's growing open data community. Contribute a dataset and help drive evidence-based decisions across the city.
            </p>
            <button
              onClick={() => setView("about")}
              style={{ background: "#FFFFFF", color: "#1A8A6D", border: "none", padding: "14px 36px", borderRadius: "6px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}
            >
              Get Involved
            </button>
          </div>

        </div>
      )}

      {/* ── DATASETS VIEW ─────────────────────────────────────────────── */}
      {view === "datasets" && (
        <div>
          <div style={{ background: "#2471A3", padding: "40px", textAlign: "center" }}>
            <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: "bold", margin: "0 0 20px 0" }}>
              All Datasets
            </h1>
            <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center" }}>
              <input
                type="text"
                placeholder="Search datasets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "440px", padding: "14px 20px", fontSize: "15px", border: "none", borderRadius: "6px 0 0 6px", outline: "none" }}
              />
              <button
                type="submit"
                style={{ background: "#1A8A6D", color: "#FFFFFF", border: "none", padding: "14px 28px", fontSize: "15px", fontWeight: "bold", borderRadius: "0 6px 6px 0", cursor: "pointer" }}
              >
                Search
              </button>
            </form>
          </div>

          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
            <h2 style={{ color: "#1B3A5C", fontSize: "20px", fontWeight: "bold", marginBottom: "24px" }}>
              {search ? `Results for "${search}"` : `All Datasets (${stats.total})`}
            </h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px", color: "#7F8C8D" }}>Loading datasets...</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                {datasets.map(dataset => (
                  <DatasetCard key={dataset.id} dataset={dataset} router={router} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ABOUT VIEW ────────────────────────────────────────────────── */}
      {view === "about" && (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
          <h1 style={{ color: "#1B3A5C", fontSize: "32px", fontWeight: "bold", margin: "0 0 16px 0" }}>
            About YYC Data Society
          </h1>
          <div style={{ height: "4px", width: "60px", background: "#2471A3", marginBottom: "32px" }} />
          <p style={{ color: "#4A4A4A", fontSize: "15px", lineHeight: "1.8", marginBottom: "24px" }}>
            The YYC Data Society Community Data Hub is a Calgary-based open data initiative built to support the city's non-profit, government, and research sectors. We centralize community datasets, making them freely accessible to anyone who wants to use data to understand and improve Calgary.
          </p>
          <p style={{ color: "#4A4A4A", fontSize: "15px", lineHeight: "1.8", marginBottom: "40px" }}>
            All datasets are published under a Creative Commons CC BY 4.0 license. Contributing organizations retain ownership of their data and are credited on every dataset page.
          </p>
          <div style={{ background: "#D6EAF8", borderLeft: "4px solid #2471A3", padding: "24px 28px", borderRadius: "0 6px 6px 0", marginBottom: "40px" }}>
            <h3 style={{ color: "#1B3A5C", fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              Want to contribute a dataset?
            </h3>
            <p style={{ color: "#4A4A4A", fontSize: "14px", lineHeight: "1.7", margin: "0 0 16px 0" }}>
              We welcome datasets from non-profit organizations, local government bodies, and academic institutions. Get in touch and we'll walk you through the process.
            </p>
            <p style={{ color: "#2471A3", fontSize: "14px", fontWeight: "bold", margin: 0 }}>
              Contact: [contact@yycdatasociety.ca]
            </p>
          </div>
          <p style={{ color: "#7F8C8D", fontSize: "13px" }}>
            Supported by Data for Good Calgary · Built with Portal.js, CKAN, and Databricks
          </p>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#1B3A5C", padding: "32px 40px", textAlign: "center", marginTop: "40px" }}>
        <p style={{ color: "#AED6F1", fontSize: "13px", margin: 0 }}>
          YYC Data Society · Community Data Hub · Calgary, Alberta · All datasets published under CC BY 4.0
        </p>
      </footer>

    </div>
  );
}

function DatasetCard({ dataset, router }) {
  return (
    <div
      onClick={() => router.push(`/datasets/${dataset.name}`)}
      style={{ background: "#FFFFFF", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "4px solid #2471A3", cursor: "pointer", transition: "box-shadow 0.2s" }}
      onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)"}
      onMouseOut={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)"}
    >
      <div style={{ marginBottom: "10px" }}>
        <span style={{ background: "#D6EAF8", color: "#2471A3", fontSize: "11px", fontWeight: "bold", padding: "3px 10px", borderRadius: "20px" }}>
          {dataset.organization?.title || "No Organization"}
        </span>
      </div>
      <h3 style={{ color: "#1B3A5C", fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0", lineHeight: "1.4" }}>
        {dataset.title}
      </h3>
      <p style={{ color: "#4A4A4A", fontSize: "13px", lineHeight: "1.6", margin: "0 0 16px 0" }}>
        {dataset.notes ? dataset.notes.slice(0, 120) + (dataset.notes.length > 120 ? "..." : "") : "No description available."}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#7F8C8D", fontSize: "12px" }}>
          {dataset.num_resources} resource{dataset.num_resources !== 1 ? "s" : ""}
        </span>
        <span style={{ background: "#D5F5E3", color: "#1A8A6D", fontSize: "11px", fontWeight: "bold", padding: "3px 10px", borderRadius: "20px" }}>
          {dataset.license_title || "Open"}
        </span>
      </div>
    </div>
  );
}
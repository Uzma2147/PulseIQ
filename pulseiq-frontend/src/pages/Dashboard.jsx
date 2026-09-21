import { useEffect, useState } from "react";

function Dashboard() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 120);
    return () => clearTimeout(t);
  }, []);

  const churnRate = 26.5;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (churnRate / 100) * circumference;

  const insights = [
    {
      label: "Contract type",
      detail:
        "Month-to-month customers churn at a far higher rate than customers on annual or two-year terms.",
      impact: 82,
    },
    {
      label: "Tenure",
      detail:
        "Customers in their first year are the most likely to leave; risk drops sharply after month 12.",
      impact: 68,
    },
    {
      label: "Monthly charges",
      detail:
        "Customers paying above the median monthly rate churn more often than lower-cost accounts.",
      impact: 51,
    },
  ];

  return (
    <div className="churn-dash">
      <style>{`
        .churn-dash {
          --ink: #10141c;
          --panel: #171d28;
          --line: #232b3a;
          --text: #edeff3;
          --muted: #8a93a3;
          --amber: #e8a33d;
          --red: #e8664e;
          --teal: #3ddc97;
          background: var(--ink);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 48px 40px 64px;
          min-height: 100%;
          box-sizing: border-box;
        }
        .churn-dash * { box-sizing: border-box; }
        .churn-dash .num {
          font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
          font-variant-numeric: tabular-nums;
        }
        .churn-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 24px;
        }
        .churn-head h1 {
          font-size: 26px;
          font-weight: 600;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .churn-head p {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          max-width: 46ch;
        }
        .churn-head .date {
          color: var(--muted);
          font-size: 13px;
          font-family: ui-monospace, monospace;
          white-space: nowrap;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .gauge-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gauge-panel .gauge-label {
          color: var(--muted);
          font-size: 13px;
          align-self: flex-start;
          margin-bottom: 14px;
        }
        .gauge-wrap {
          position: relative;
          width: 180px;
          height: 180px;
        }
        .gauge-svg { transform: rotate(-90deg); }
        .gauge-value {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gauge-value .big {
          font-size: 36px;
          font-weight: 600;
          line-height: 1;
        }
        .gauge-value .small {
          margin-top: 6px;
          font-size: 11.5px;
          color: var(--muted);
          text-align: center;
        }
        .readouts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          border-radius: 16px;
          overflow: hidden;
        }
        .readout {
          background: var(--panel);
          padding: 22px 24px;
        }
        .readout .rlabel {
          color: var(--muted);
          font-size: 13px;
          margin-bottom: 10px;
        }
        .readout .rvalue {
          font-size: 28px;
          font-weight: 600;
        }
        .readout .rvalue.accent-red { color: var(--red); }
        .readout .rvalue.accent-teal { color: var(--teal); }
        .insights-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px 28px 6px;
        }
        .insights-panel h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 20px;
        }
        .insight-row {
          padding: 18px 0;
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: 150px 1fr 130px;
          gap: 20px;
          align-items: center;
        }
        .insight-row .ilabel {
          font-size: 14px;
          font-weight: 600;
        }
        .insight-row .idetail {
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.5;
        }
        .impact-bar {
          height: 6px;
          border-radius: 3px;
          background: #0c0f16;
          overflow: hidden;
        }
        .impact-bar span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, var(--amber), var(--red));
          border-radius: 3px;
          width: 0%;
          transition: width 1s cubic-bezier(.2,.8,.2,1);
        }
        .impact-num {
          margin-top: 6px;
          text-align: right;
          font-size: 12.5px;
          color: var(--muted);
        }
        @media (max-width: 760px) {
          .hero-grid { grid-template-columns: 1fr; }
          .readouts { grid-template-columns: 1fr; }
          .insight-row { grid-template-columns: 1fr; gap: 10px; }
          .churn-head { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="churn-head">
        <div>
          <h1>Customer risk dashboard</h1>
          <p>A live read on churn exposure across the customer base.</p>
        </div>
        <div className="date">Updated today</div>
      </div>

      <div className="hero-grid">
        <div className="gauge-panel">
          <div className="gauge-label">Churn rate</div>
          <div className="gauge-wrap">
            <svg className="gauge-svg" width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#232b3a" strokeWidth="12" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e8a33d"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={animate ? offset : circumference}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
              />
            </svg>
            <div className="gauge-value">
              <span className="big num">{churnRate}%</span>
              <span className="small">of 7,043 customers</span>
            </div>
          </div>
        </div>

        <div className="readouts">
          <div className="readout">
            <div className="rlabel">Total customers</div>
            <div className="rvalue num">7,043</div>
          </div>
          <div className="readout">
            <div className="rlabel">High risk customers</div>
            <div className="rvalue num accent-red">1,247</div>
          </div>
          <div className="readout">
            <div className="rlabel">Avg. monthly charges</div>
            <div className="rvalue num">$64.76</div>
          </div>
          <div className="readout">
            <div className="rlabel">Retained customers</div>
            <div className="rvalue num accent-teal">5,796</div>
          </div>
        </div>
      </div>

      <div className="insights-panel">
        <h2>What's driving churn</h2>
        {insights.map((item) => (
          <div className="insight-row" key={item.label}>
            <div className="ilabel">{item.label}</div>
            <div className="idetail">{item.detail}</div>
            <div>
              <div className="impact-bar">
                <span style={{ width: animate ? `${item.impact}%` : "0%" }} />
              </div>
              <div className="impact-num num">{item.impact}% impact</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

import React from "react";
import "./TermsAndConditionsPage.css";

export default function TermsAndConditionsPage() {
  return (
    <div className="terms-container" style={{ marginTop: "80px" }}>
      <h1 className="title">E-Library Code of Conduct</h1>

      <h2>General Expectations</h2>
      <p><strong>Safe and Welcoming Spaces:</strong> All users should feel safe, clean, and welcome.</p>
      <p><strong>Access to Resources:</strong> Users should have access to collections, equipment, and services for academic purposes (research and coursework).</p>
      <p><strong>Privacy and Confidentiality:</strong> Users are entitled to privacy and confidentiality in their use of library collections and services.</p>

      <h2>Behavior</h2>
      <p><strong>Compliance with Staff Requests:</strong> Users are expected to comply with requests from library staff and security personnel. Identification may be requested.</p>
      <p><strong>Courteous Conduct:</strong> Respectful behavior is mandatory. Inappropriate behaviors include excessive noise, rowdiness, abusive language, and offensive sexual behavior.</p>
      <p><strong>Posting Announcements:</strong> Flyers may only be posted on designated bulletin boards.</p>
      <p><strong>Dress Code:</strong> Users should dress appropriately (shirts and shoes required).</p>
      <p><strong>Cleanliness:</strong> Maintain a clean environment by disposing of trash properly.</p>
      <p><strong>Personal Property Safety:</strong> Keep personal belongings with you; E-Library is not responsible for unattended items.</p>
      <p><strong>Sleeping in the Library:</strong> For personal safety, sleeping in the library is not recommended.</p>

      <h2>Food and Drink</h2>
      <p>Food and drink are allowed on all floors except near computers.</p>

      <h2>Abuse of Library Resources</h2>
      <p>Users must respect library collections and facilities. Intentional damage may result in penalties.</p>
      <div className="bullet-points">
        <p><strong>Prohibited behaviors include:</strong></p>
        <p>Writing in or damaging library materials</p>
        <p>Careless actions leading to damage</p>
        <p>Leaving items unattended</p>
        <p>Removing materials without proper checkout</p>
        <p>Misplacing materials to hinder access for others</p>
      </div>

      <h2>Use of Electronic/Digital Resources</h2>
      <p>Users must adhere to E-Library Terms of Use for electronic resources.</p>

      <h2>Scanning, Copying, and Copyright</h2>
      <p>Use of library equipment must comply with U.S. copyright laws and library policies.</p>

      <h2>General Guidelines</h2>
      <p>Observe all federal and state laws, local ordinances, and university policies.</p>
      <p><strong>Tobacco-Free Campus:</strong> Smoking and electronic cigarettes are prohibited.</p>
      <p><strong>Filming and Photography:</strong> Require prior approval for filming and photography in E-Library.</p>
      <p><strong>Service Animals Only:</strong> Only service animals are allowed in E-Library.</p>
    </div>
  );
}
import React, { useState } from 'react';

const Donations: React.FC = () => {
  // State for selected donation amount
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // Handle predefined amount selection
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Reset custom amount if a predefined amount is selected
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null); // Reset predefined amount if custom amount is entered
  };

  // Handle donation submission
  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    // Validate the amount
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    // Simulate donation processing
    setTimeout(() => {
      setDonationSuccess(true);
    }, 1000); // Simulate a 1-second delay for processing
  };

  // Reset the form
  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setDonationSuccess(false);
  };

  return (
    <div className="donations-container">
      <h2>Donate to the Library</h2>
      {donationSuccess ? (
        <div className="thank-you-message">
          <h3>Thank You for Your Donation!</h3>
          <button onClick={resetForm}>Donate Again</button>
        </div>
      ) : (
        <>
          <div className="donation-options">
            <button
              className={selectedAmount === 5 ? 'selected' : ''}
              onClick={() => handleAmountSelection(5)}
            >
              $5
            </button>
            <button
              className={selectedAmount === 10 ? 'selected' : ''}
              onClick={() => handleAmountSelection(10)}
            >
              $10
            </button>
            <button
              className={selectedAmount === 5 ? 'selected' : ''}
              onClick={() => handleAmountSelection(5)}
            >
              $50
            </button>
          </div>
          <div className="custom-amount">
            <input
              type="number"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              min="1"
            />
          </div>
          <button className="donate-button" onClick={handleDonate}>
            Donate Now
          </button>
        </>
      )}
    </div>
  );
};

export default Donations;

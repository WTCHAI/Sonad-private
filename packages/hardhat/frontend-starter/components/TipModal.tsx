// Tip modal component with form and wallet integration
import React, { useState } from "react";
import { SonadPost } from "../types/twitter";

interface TipModalProps {
  post: SonadPost;
  onClose: () => void;
  onTip: (amount: string) => Promise<void>;
}

const TipModal: React.FC<TipModalProps> = ({ post, onClose, onTip }) => {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetAmounts = ["1", "10", "100", "500"];

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount("");
    setError(null);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount(value);
    setError(null);
  };

  const validateAmount = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    if (num > 1000) {
      setError("Maximum tip amount is 1000 MON");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAmount(amount)) return;

    setIsLoading(true);
    setError(null);

    try {
      await onTip(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send tip");
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedFee = (parseFloat(amount || "0") * 0.1).toFixed(0); // 10% platform fee
  const creatorReceives = (parseFloat(amount || "0") * 0.9).toFixed(0); // 90% to creator

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tip Creator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
          <img src={post.profile_image_url} alt={post.name} className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold text-gray-900">{post.name}</div>
            <div className="text-sm text-gray-600">@{post.username}</div>
          </div>
        </div>

        {/* Tip Form */}
        <form onSubmit={handleSubmit}>
          {/* Preset Amounts */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select (MON)</label>
            <div className="grid grid-cols-2 gap-2">
              {presetAmounts.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAmountSelect(preset)}
                  className={`p-3 rounded-lg border text-center font-medium transition-all ${
                    amount === preset
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                  }`}
                >
                  {preset} MON
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount (MON)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="1000"
              placeholder="0"
              value={customAmount}
              onChange={e => handleCustomAmountChange(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Breakdown */}
          {amount && parseFloat(amount) > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Your tip:</span>
                <span className="font-medium">{amount} MON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Creator receives:</span>
                <span className="font-medium text-green-600">{creatorReceives} MON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform fee (10%):</span>
                <span className="font-medium text-gray-500">{estimatedFee} MON</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                !amount || parseFloat(amount) <= 0 || isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </span>
              ) : (
                `Send Tip 💰`
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            💡 <strong>Tip:</strong> Tips are sent directly to creators with minimal platform fees. Make sure you have
            enough MON tokens in your wallet for tipping.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipModal;

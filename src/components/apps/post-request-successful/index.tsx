interface PostRequestSuccessfulProps {
  itemName?: string;
  itemId: string;
  onClose: () => void;
  onTrackStatus: (id: string | number) => void;
  type: 'update' | 'new';
}

export const PostRequestSuccessful: React.FC<PostRequestSuccessfulProps> = ({
  itemName,
  itemId,
  onClose,
  onTrackStatus,
  type,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <i className="ri-check-line text-3xl text-green-500"></i>
      </div>

      {type === 'new' && (
        <h2 className="text-2xl font-bold text-center mb-2">Item Post Request Sent!</h2>
      )}
      {type === 'update' && (
        <h2 className="text-2xl font-bold text-center mb-2">Item Update Request Sent!</h2>
      )}

      {type === 'new' && (
        <p className="text-center text-gray-600 max-w-md mb-8">
          Your request to sell <span className="font-medium">{itemName ?? 'New Product'}</span> with
          ID <span className="font-medium">{itemId}</span> has been submitted successfully.
        </p>
      )}

      {type === 'update' && (
        <p className="text-center text-gray-600 max-w-md mb-8">
          Your request to update Product <span className="font-medium">{itemId}</span> has been
          submitted successfully.
        </p>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-md">
        {type === 'new' && (
          <p className="text-sm text-gray-600 text-center">
            Your item will be listed on the marketplace once all verifications are complete and the
            platform fee is processed. We'll notify you of any updates.
          </p>
        )}
        {type === 'update' && (
          <p className="text-sm text-gray-600 text-center">
            Your item will be updated on the marketplace once all verifications are complete. We'll
            notify you of any updates.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={() => {
            onClose();
            onTrackStatus(itemId);
          }}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Track Status
        </button>
      </div>
    </div>
  );
};

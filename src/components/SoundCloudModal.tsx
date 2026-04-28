interface SoundCloudModalProps {
    isOpen: boolean;
    onClose: () => void;
    trackUrl: string; // ex: "https://on.soundcloud.com/wRR4bSX5r8OZb9aQo7"
}

const SoundCloudModal = ({ isOpen, onClose, trackUrl }: SoundCloudModalProps) => {
    if (!isOpen) return null;

    // Convertir le lien court en iframe-compatible
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl h-[70vh] bg-gray-900 border border-cyan-500 rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <h3 className="text-cyan-400 font-mono">Lecteur SoundCloud — Aincrad</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Lecteur SoundCloud */}
                <div className="flex-1 p-2">
                    <iframe
                        width="100%"
                        height="100%"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={embedUrl}
                        title="SoundCloud"
                        className="rounded"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default SoundCloudModal;

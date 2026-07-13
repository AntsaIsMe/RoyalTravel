export default function SearchResPop({ results = [], onSelect }) {
    if (results.length === 0) return null;

    return (
        <div className="absolute left-0 right-0 -mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
            {results.map((client, index) => (
                <div 
                    key={client.id || index}
                    onClick={() => onSelect && onSelect(client)}
                    className="p-2.5 hover:bg-primary-light hover:text-text cursor-pointer transition-colors border-b last:border-none border-gray-100 text-sm flex items-center justify-between"
                >
                    <p className="font-medium">{client.nom || client.idvoit}</p>
                    {client.numtel && (
                        <p className="text-xs text-gray-400 group-hover:text-secondary">
                            {client.numtel}
                        </p>
                    )}
                    {client.design && (
                        <p className="text-xs text-gray-400 group-hover:text-secondary">
                            {client.design}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
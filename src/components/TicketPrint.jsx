import { QRCodeSVG } from "qrcode.react";

/**
 * TicketPrint — génère un ticket imprimable (inscription / rebuy / add-on).
 * Format pensé pour imprimante thermique/A6. Utilise window.print() sur le
 * conteneur ciblé via CSS @media print (voir index.css pour la classe .print-ticket).
 *
 * type: "buyin" | "rebuy" | "addon"
 */
export default function TicketPrint({ type, tournamentName, player, seat, amount, ticketId }) {
  const labels = {
    buyin: "TICKET D'INSCRIPTION",
    rebuy: "TICKET DE REBUY",
    addon: "TICKET D'ADD-ON",
  };

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="print-ticket bg-white text-black w-[280px] p-4 font-body mx-auto border border-dashed border-gray-400">
        <div className="text-center font-display text-lg tracking-wide">
          19PokerClub
        </div>
        <div className="text-center text-xs uppercase tracking-widest mt-1 mb-3">
          {labels[type]}
        </div>
        <div className="text-sm space-y-1">
          <div>
            <strong>Tournoi :</strong> {tournamentName}
          </div>
          <div>
            <strong>Joueur :</strong> {player}
          </div>
          {seat && (
            <div>
              <strong>Siège :</strong> {seat}
            </div>
          )}
          {amount != null && (
            <div>
              <strong>Montant :</strong> {amount} €
            </div>
          )}
        </div>
        <div className="flex justify-center mt-3">
          <QRCodeSVG value={ticketId} size={80} />
        </div>
        <div className="text-center text-[10px] mt-2 text-gray-500">{ticketId}</div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 mx-auto block px-4 py-2 bg-felt-gold text-felt-bg rounded-md font-display"
      >
        Imprimer
      </button>
    </div>
  );
}

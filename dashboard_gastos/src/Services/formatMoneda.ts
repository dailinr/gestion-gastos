export function formatMoneda(amount: number) {
    return new Intl.NumberFormat('es-CO').format(amount);
}

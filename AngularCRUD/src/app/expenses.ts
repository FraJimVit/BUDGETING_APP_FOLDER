// Interface para representar un gasto individual
export interface Expense {
    id: string; // ID único del gasto
    userId: string; // ID del usuario asociado al gasto
    monthlyBudgetId: string; // ID del presupuesto mensual al que está asociado el gasto
    date: string; // Fecha del gasto
    name: string; // Nombre o descripción del gasto
    amount: number; // Monto del gasto
  }
  
  // Interface para representar una categoría de gastos
  export interface Category {
    name: string; // Nombre de la categoría
    expanded: boolean; // Para manejar el estado de expansión de la categoría en el UI
    newExpenseAmount?: number; // Cantidad del nuevo gasto a añadir
    newExpenseName?: string; // Nombre del nuevo gasto a añadir
    expenses: { [date: string]: Expense[] }; // Objeto con fecha como clave y una lista de gastos como valor
  }
  
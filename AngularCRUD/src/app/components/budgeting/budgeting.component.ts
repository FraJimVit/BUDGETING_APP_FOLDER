import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-budgeting',
  standalone: true,
  templateUrl: './budgeting.component.html',
  styles: [],
})
export class BudgetingComponent {
  @Output() navigatePage = new EventEmitter<string>();

  navigateToMonthlyBudget() {
    this.navigatePage.emit('monthlybudget');
  }

  navigateToExpenses() {
    this.navigatePage.emit('expenses');
  }
}

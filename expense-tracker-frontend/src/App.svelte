<script lang="ts">
  import "./app.css";
  import { Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  // import { toDimension } from "chart.js/helpers";

  // Transactions and form state
  let transactions: any[] = [];
  let buckets: any[] = [];
  let amount: number = 0;
  let limit: number = 0;
  let balance: number = 0;
  let balanceEntry: number = 0;
  let name: string = "";
  let dueDate: string = "";
  let type: string = "withdrawal";
  let expenseCategory: string = ""; // <-- starts empty, force user selection
  let creditCardBalance: number = 0;
  let nonRecurring: boolean = false;

  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let total = 0;
  $: netChange = total + balance;

  let showAddModal = false;
  let showBalanceModal = false;
  let showEditModal = false;
  let showBucketModal = false;
  let editingTransaction: any = {};

  const today = new Date();
  const currentDate = formatMMDD(today);
  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const oneMonthFromNow = formatMMDD(nextMonthDate);

  function formatMMDD(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/summary");
      const data = await res.json();
      totalDeposits = data.total_deposits || 0;
      totalWithdrawals = data.total_withdrawals || 0;
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/balance");
      const data = await res.json();
      console.log("data:  ", data);
      balance = data.balance || 0;
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchTransactions = async () => {
  // todo
  };

  const fetchBuckets = async () => {
  // todo
  };

  const updateBalance = async () => {
  // todo
  };

  const addTransaction = async () => {
  // todo
  };

  const deleteTransaction = async () => {
  // todo
  };

  const editTransaction = () => {
  // todo
  };

  const saveTransactionEdits = async () => {
  // todo
  };

  onMount(() => {
    fetchTransactions();
    fetchSummary();
    // fetchBalance();
    fetchBuckets();
  });
</script>

<main>
  <div class="container" style="display: flex; gap: 2rem; flex-direction: row; align-items: flex-start;">
    <!-- LEFT SPLITTER -->
    <div class="left-splitter" style="flex: 1; display: flex; flex-direction: column; align-items: center;">
      <div class="buttons-top" style="margin-bottom: 1rem; display: flex; gap: 10px; flex-direction: column; max-width: 200px; align-items: center;">
        <Button style="margin-left: 10px; width: 300px" on:click={() => (showAddModal = true)}>Add Transaction</Button>
        <Button style="margin-left: 10px; width: 300px" on:click={() => (showBucketModal = true)}>Add Bucket</Button>
        <Button style="margin-left: 10px; width: 300px" on:click={() => (showBalanceModal = true)}>Update Balance</Button>
      </div>

      <div class="transaction-container">
        <div class="transaction-input">
          <h1>Current Balance: {formatCurrency(balance)}</h1>
          <hr />
          <h3>
            Total Expenses:
            <span class="negative">{formatCurrency(totalDeposits)}</span>
          </h3>
        </div>
      </div>
    </div>

    <!-- RIGHT SPLITTER -->
    <div class="right-splitter" style="flex: 2; display: flex; flex-direction: column; gap: 1.5rem;">
      <div class="buckets-span">
        <div class="buckets">
          <h2>Expense Buckets:</h2>
          <ul>
            {#each buckets as bucket}
              <li>
                <div class="tx-row">
                  <strong>{bucket.name}</strong>
                  <div class="tx-desc">Limit: ${bucket.limit_amount}</div>
                  <div class="tx-desc">Total Spent: ${bucket.current_amount}</div>
                  <div class="tx-desc">
                    Remaining: ${bucket.limit_amount - bucket.current_amount} ({((bucket.limit_amount / bucket.current_amount) * 100).toFixed(1)}%)
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="transaction-history">
        <h2>Expense Forecast from {currentDate} - {oneMonthFromNow}</h2>
        <ul>
          {#each transactions as tx}
            <li class="transaction-item">
              <div class="tx-row">
                <div class="tx-amount negative">{formatCurrency(tx.amount)}</div>
                <div class="tx-date">{tx.date ? new Date(tx.date).toLocaleDateString() : "No date"}</div>
                <div class="tx-desc">{tx.description || "No description"}</div>
                <div class="tx-category">{tx.category || "Uncategorized"}</div>
                <div class="tx-due">{tx.due_date || "None"}</div>

                {#if tx.category === "credit_card"}
                  <div class="tx-cc-extra">
                    <div class="cc-balance">Balance: {formatCurrency(tx.credit_card_balance || 0)}</div>
                    <div class="cc-payment">
                      <label>
                        Pay Amount:
                        <input
                          type="number"
                          min="0"
                          max={tx.credit_card_balance}
                          step="0.01"
                          bind:value={tx.payAmount}
                          placeholder="Enter payment amount"
                        />
                      </label>
                    </div>
                  </div>
                {/if}

                <button class="delete-button" aria-label="Delete" on:click={() => deleteTransaction(tx._id)}>×</button>
                <button class="edit-button" aria-label="Edit" on:click={() => editTransaction(tx)}>✎</button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  {#if showAddModal}
  <div class="modal-overlay" role="presentation" on:click={() => (showAddModal = false)}>
    <div 
    class="modal-content" 
    on:click|stopPropagation
    role="presentation"
    style="background-color: #1a1a1a; color: white; padding: 1.5rem; border-radius: 8px;">
    <h2>Add Transaction</h2>

      <label for="amount">Amount:</label>
      <input
        type="number"
        min="0.00"
        step="0.01"
        bind:value={amount}
        placeholder="Amount"
      />
      <input type="text" bind:value={name} placeholder="Name" />
      <input
        type="text"
        bind:value={dueDate}
        placeholder="Due Date (MM/DD)"
        maxlength="5"
      />

      <label for="expense-category">Expense Category</label>
      <select bind:value={expenseCategory}>
        <option value="" disabled selected hidden>Select category</option>
        <option value="credit_card">Credit Card</option>
        <option value="personal_loan">Personal Loan</option>
        <option value="student_loan">Student Loan</option>
        <option value="other">Other</option>
      </select>


      <div class="modal-actions">
        <Button color="light" on:click={addTransaction}>Add</Button>
        <Button color="light" on:click={() => (showAddModal = false)}>Cancel</Button>
      </div>
    </div>
  </div>
  {/if}

  {#if showBalanceModal}
    <div class="modal-overlay" role="presentation" on:click={() => (showBalanceModal = false)}>
      <div 
      class="modal-content" 
      on:click|stopPropagation
      role="presentation"
      style="background-color: #1a1a1a; color: white; padding: 1.5rem; border-radius: 8px;">
        <h2>Update Balance</h2>
        <input
          type="number"
          min="0.00"
          step="0.01"
          bind:value={balanceEntry}
          placeholder="Set Balance"
        />
        <div
          style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem;"
        >
          <Button color="light" on:click={updateBalance}>Update</Button>
          <Button color="light" on:click={() => (showBalanceModal = false)}
            >Cancel</Button
          >
        </div>
      </div>
    </div>
  {/if}

  {#if showEditModal}
    <div class="modal-overlay" role="presentation" on:click={() => (showEditModal = false)}>
      <div 
      class="modal-content" 
      on:click|stopPropagation
      role="presentation"
      style="background-color: #1a1a1a; color: white; padding: 1.5rem; border-radius: 8px;">
        <h2>Edit Transaction</h2>
        <input
          type="number"
          min="0.00"
          step="0.01"
          bind:value={editingTransaction.amount}
        />
        <input
          type="text"
          bind:value={editingTransaction.description}
          placeholder="Name"
        />
        <input
          type="text"
          bind:value={editingTransaction.due_date}
          placeholder="Due Date (MM/DD)"
          maxlength="5"
        />

        <select bind:value={editingTransaction.type}>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>

        <label for="category">Expense Category</label>
        <select bind:value={editingTransaction.category} id="category">
          <option value="" disabled selected hidden>Select category</option>
          <option value="credit_card">Credit Card</option>
          <option value="personal_loan">Personal Loan</option>
          <option value="student_loan">Student Loan</option>
          <option value="other">Other</option>
        </select>

        <div
          style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem;"
        >
          <Button color="light" on:click={saveTransactionEdits}>Save</Button>
          <Button color="light" on:click={() => (showEditModal = false)}
            >Cancel</Button
          >
        </div>
      </div>
    </div>
  {/if}

  {#if showBucketModal}
    <div class="modal-overlay" role="presentation" on:click={() => (showBucketModal = false)}>
      <div 
      class="modal-content" 
      on:click|stopPropagation
      role="presentation"
      style="background-color: #1a1a1a; color: white; padding: 1.5rem; border-radius: 8px;">
        <h2>Add Bucket</h2>
        <input type="text" bind:value={name} placeholder="Bucket name" />
        <label for="limit">Limit Amount:</label>
        <input
          type="Limit"
          min="0.00"
          step="0.01"
          bind:value={limit}
          placeholder="Bucket limit"
          id="limit"
          name="limit"

        />
        <div class="modal-actions">
          <Button color="light" on:click={() => (showBucketModal = false)}>Cancel</Button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 2rem;
    font-family: sans-serif;
    max-width: 900px;
    margin: auto;
  }

  .buttons-top {
    display: flex;
  }

  .transaction-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .transaction-input {
    flex: 1;
    max-width: 60%;
    padding-right: 20px;
  }

  .transaction-history {
    width: 100%;
    max-height: 700px;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    background-color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    color: #111;
  }

  .positive {
    color: green;
  }

  .negative {
    color: red;
  }

  input,
  select {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    color: #111;
  }

  .transaction-item {
    padding: 0.3rem 0.5rem;
    margin-bottom: 0.3rem;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    box-shadow: none;
    background-color: #fff;
  }

  .tx-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
  }

  .tx-amount {
    min-width: 90px;
    font-weight: 600;
  }

  .tx-date {
    min-width: 90px;
    color: #666;
  }

  .tx-desc {
    flex: 2;
    min-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-category {
    flex: 1;
    min-width: 200px;
    color: #444;
    white-space: nowrap;
  }

  .tx-due {
    min-width: 70px;
    color: #666;
    text-align: center;
  }

  .delete-button,
  .edit-button {
    width: 24px;
    height: 24px;
    border: none;
    color: white;
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    padding: 0;
    user-select: none;
    transition: background-color 0.2s ease;
  }

  .delete-button {
    background-color: #e53e3e;
  }
  .delete-button:hover {
    background-color: #c53030;
  }

  .edit-button {
    background-color: #3182ce;
    margin-left: 5px;
  }
  .edit-button:hover {
    background-color: #2b6cb0;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
  }

  .modal-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
</style>

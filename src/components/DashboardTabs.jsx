import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

import { useState } from "react";
import Wallet from "./Wallet";
import FAQ from "./FAQ";
import Analytics from "./Analytics";
import MyFavourite from "./MyFavourite";

const DashboardTabs = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Primary Account",
      email: "primary@example.com",
      isDefault: true,
    },
  ]);
  const [walletHistory, setWalletHistory] = useState([
    { id: 1, type: "Credit", amount: 1500, date: "2025-08-20" },
    { id: 2, type: "Debit", amount: 300, date: "2025-08-22" },
  ]);
  const [walletTotal, setWalletTotal] = useState(1200);

  const setDefaultAccount = (id) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    setAccounts(updated);
  };

  const addAmount = (amount) => {
    const amtNum = parseInt(amount, 10);
    if (!isNaN(amtNum) && amtNum > 0) {
      setWalletTotal(walletTotal + amtNum);
      setWalletHistory([
        ...walletHistory,
        {
          id: Date.now(),
          type: "Credit",
          amount: amtNum,
          date: new Date().toISOString(),
        },
      ]);
      message.success("Amount added successfully");
    }
  };

  return (
    <Tabs
      defaultActiveKey="analytics"
      type="line"
      className="bg-white rounded-2xl p-6 shadow-md"
    >
      {/* Existing Analytics Tab */}
      <TabPane tab="My Analytics" key="analytics">
        <Analytics />
      </TabPane>

      {/* Existing My Favourite Tab */}
      <TabPane tab="My Favourite" key="favourite">
        <MyFavourite />
      </TabPane>

      {/* Wallet Tab */}
      <TabPane tab="Wallet" key="wallet">
        <Wallet
          walletHistory={walletHistory}
          walletTotal={walletTotal}
          addAmount={addAmount}
        />
      </TabPane>

      {/* FAQ Tab */}
      <TabPane tab="FAQ" key="faq">
        <FAQ />
      </TabPane>
    </Tabs>
  );
};

export default DashboardTabs;

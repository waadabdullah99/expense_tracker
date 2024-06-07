import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const CardsInfo = ({ budgetList }) => {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);

    useEffect(() => {
        if (budgetList) {
            calculateCardInfo();
        }
    }, [budgetList]);

    const calculateCardInfo = () => {
        console.log(budgetList);
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        budgetList.forEach(element => {
            totalBudget_ += Number(element.amount);
            totalSpend_ += element.totalSpend;
        });
        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
        console.log(totalBudget_, totalSpend_);
    };

    return (
        <div>
            {budgetList?.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm">Total Budget</h2>
                            <h2 className="font-bold text-2xl">SAR {totalBudget}</h2>
                        </div>
                        <PiggyBank className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                    <div className="p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm">Total Spending</h2>
                            <h2 className="font-bold text-2xl">SAR {totalSpend}</h2>
                        </div>
                        <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                    <div className="p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm">No. of Budget</h2>
                            <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
                        </div>
                        <Wallet className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardsInfo;

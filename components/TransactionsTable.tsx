import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants";
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
    const {borderColor, backgroundColor, textColor, chipBackgroundColor} = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;  //we say as keyof and type of cuz of typescript, this way it knows that we are passing only listed categories
    // console.log("AGGAAGGA ", category)
    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
        </div>
    )
}

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
    // console.log('tKKKKKK ', transactions);
  return (
    <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="bg-[#f9fafb]">
            <TableRow>
                <TableHead className="px-2">Transactions</TableHead>
                <TableHead className="px-2">Amount</TableHead>
                <TableHead className="px-2">Status</TableHead>
                <TableHead className="px-2">Date</TableHead>
                <TableHead className="px-2 max-md:hidden">Channel</TableHead>
                <TableHead className="px-2 max-md:hidden">Category</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
                {transactions.map((t: Transaction) => {
                    const status = getTransactionStatus(new Date(t.date));  // getrTransactionssStatus returns todays days and date of towo days ago since transactions takes 1-2 says to process in sandbox
                    const amount =  formatAmount(t.amount); 

                    const isDebit = t.type === 'debit';
                    const isCredit = t.type === 'credit';
                    // console.log("dsfdssdfsfds: ", t )
                    return(
                            <TableRow key={t.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]': 'bg-[#F6FEF9]'} !over:bg-none !over:bg-b-DEFUALT`}>
                            <TableCell className="max-w-[250px] pl-2 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-14 truncate font-semibold text-[#244054]">
                                        {removeSpecialCharacters(t.name)}
                                    </h1>
                                </div>
                            </TableCell>

                            <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#F04438]' : 'text-[#039855]'}`}>
                                {isDebit? `-${amount}` : isCredit ? amount : amount}
                            </TableCell>

                            <TableCell className="pl-2 pr-10">
                                <CategoryBadge category={status}/> 
                            </TableCell>

                            <TableCell className="min-w-32 pl-2 pr-10">
                                {formatDateTime(new Date(t.date)).dateTime}
                            </TableCell>

                            <TableCell className="pl-2 pr-10 capitalize min-w-24">
                                {t.paymentChannel}
                            </TableCell>
                            
                            <TableCell className="pl-2 pr-10 max-md:hidden">
                                <CategoryBadge category={t.category}/> 
                            </TableCell>
                        </TableRow>                        
                    )
                })}            
        </TableBody>
    </Table>
  )
}

export default TransactionsTable


// px-2 : padding left and right 2 
// pl-2 : padding left 2
// pr-2 : padding right 2
// max-md:hidden : hiden on smaller devices
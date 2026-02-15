import { TWalletFeeBreakdown, TWalletFeeOptions, Wallet } from "@Lib/wallet.ts";
import { Env } from "@Core/common/env.ts";
import e from "validator";

const feeSlabValidator = e.array(e.object({
  account: e.string(),
  user: e.string(),
  name: e.string(),
  fixed: e.optional(e.number()),
  percentage: e.optional(e.number()),
}));

export default {
  pre: () => {
    Wallet.onCalculateFee = async (options: TWalletFeeOptions) => {
      const namespace = `WALLET_FEE_SLAB_${options.category.toUpperCase()}`;
      const rawFeeSlab = await Env.get(
        [
          namespace,
          options.type?.toUpperCase(),
          options.currency?.toUpperCase(),
        ].filter(Boolean).join("_"),
        true,
      ) ?? await Env.get(
        [
          namespace,
          options.type?.toUpperCase(),
        ].filter(Boolean).join("_"),
        true,
      ) ?? await Env.get(namespace, true);

      if (!rawFeeSlab) {
        return {
          total: 0,
          breakdown: [],
        };
      }

      const feeSlab = await feeSlabValidator.validate(JSON.parse(rawFeeSlab));

      const breakdown: TWalletFeeBreakdown[] = [];

      for (const { account, user, name, fixed, percentage } of feeSlab) {
        if (fixed || percentage) {
          const amount = (fixed ?? 0) +
            ((options.amount / 100) * (percentage ?? 0));

          if (amount) {
            breakdown.push({
              account,
              user,
              name,
              amount,
            });
          }
        }
      }

      const total = breakdown.reduce((sum, { amount }) => sum + amount, 0);

      return {
        total,
        breakdown,
      };
    };
  },
};

const buildWhere = (query) => {
  const where = {};

  if (query.email) where.email = query.email;
  if (query.email_contains)
    where.email = { $regex: query.email_contains, $options: "i" };

  if (query.company_contains)
    where.company = { $regex: query.company_contains, $options: "i" };
  if (query.city_contains)
    where.city = { $regex: query.city_contains, $options: "i" };

  if (query.status) where.status = query.status;
  if (query.status_in) where.status = { $in: query.status_in.split(",") };

  if (query.source) where.source = query.source;
  if (query.source_in) where.source = { $in: query.source_in.split(",") };

  if (query.score) where.score = Number(query.score);
  if (query.score_gt)
    where.score = { ...where.score, $gt: Number(query.score_gt) };
  if (query.score_lt)
    where.score = { ...where.score, $lt: Number(query.score_lt) };

  if (query.lead_value_gt)
    where.lead_value = { $gt: Number(query.lead_value_gt) };
  if (query.lead_value_lt)
    where.lead_value = {
      ...where.lead_value,
      $lt: Number(query.lead_value_lt),
    };

  if (query.created_at_after)
    where.created_at = { $gt: new Date(query.created_at_after) };
  if (query.created_at_before)
    where.created_at = {
      ...where.created_at,
      $lt: new Date(query.created_at_before),
    };

  if (query.is_qualified !== undefined)
    where.is_qualified = query.is_qualified === "true";

  return where;
};

module.exports = { buildWhere };

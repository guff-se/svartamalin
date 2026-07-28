-- Remove plus/minus theme columns from practical_info.
delete from practical_info
where key in ('theme_fits', 'theme_doesnt_fit');

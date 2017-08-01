DELETE from catchment_address_mapping;
DELETE from catchment;

insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Ghotpadi Cluster','48adfc10-c501-48ab-87b6-622b48e64682', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (1, (select id from address_level where title='Ghotpadi'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (1, (select id from address_level where title='Bodange'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (1, (select id from address_level where title='Bhatpar'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (1, (select id from address_level where title='Darbha'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (1, (select id from address_level where title='Juwi'), 1, 1, 1, current_timestamp, current_timestamp);


insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Gopnar Cluster','11c2952b-8fd2-409d-a3cd-020e37d280f8', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (2, (select id from address_level where title='Gopnar'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (2, (select id from address_level where title='Hodri'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (2, (select id from address_level where title='Lashkar'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (2, (select id from address_level where title='Aldandi'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (2, (select id from address_level where title='Morodpar'), 1, 1, 1, current_timestamp, current_timestamp);



insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Jinjgaon Cluster','4a2bc293-ef50-45d0-abc5-4a6d79422494', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (3, (select id from address_level where title='Jinjgaon'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (3, (select id from address_level where title='Gurnoor'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (3, (select id from address_level where title='Marampalli'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (3, (select id from address_level where title='Rela'), 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Midapalli Cluster','29f50e17-e941-4cd0-b7e1-dac91ed032a6', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (4, (select id from address_level where title='Midapalli'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (4, (select id from address_level where title='Kawande'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (4, (select id from address_level where title='Nelgunda'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (4, (select id from address_level where title='Morometta'), 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Mirgudwancha Cluster','4a2bc293-ef50-45d0-abc5-4a6d79422494', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (5, (select id from address_level where title='Midapalli'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (5, (select id from address_level where title='Kawande'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (5, (select id from address_level where title='Nelgunda'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (5, (select id from address_level where title='Morometta'), 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Pengunda Cluster','ba0498ef-51e6-47f3-b41b-9e841320c23a', 1, 1, 1, current_timestamp, current_timestamp);

insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (6, (select id from address_level where title='Pengunda'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (6, (select id from address_level where title='Parainar'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (6, (select id from address_level where title='Kucher'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (6, (select id from address_level where title='Mahakapadi'), 1, 1, 1, current_timestamp, current_timestamp);
insert into catchment_address_mapping (catchment_id, addresslevel_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES (6, (select id from address_level where title='Gongwada'), 1, 1, 1, current_timestamp, current_timestamp);
-- CREATE DATABASE surtipollobd;
-- use surtipollobd;

-- ==============================
-- CREAR TABLA EPS
-- ==============================
CREATE TABLE CARGO (
  ID TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  NombreCargo VARCHAR(50) NOT NULL
);

INSERT INTO CARGO (NombreCargo) VALUES ('Administrador');
INSERT INTO CARGO (NombreCargo) VALUES ('Almacenista');
INSERT INTO CARGO (NombreCargo) VALUES ('Cajero');
-- ==============================
-- CREAR TABLA EPS
-- ==============================
CREATE TABLE EPS (
  COD_EPS TINYINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  EPS_Nombre VARCHAR(50) NOT NULL,
  DESCRIPCION VARCHAR(100) NULL
);

INSERT INTO EPS (EPS_Nombre) VALUES ('Sanitas');
INSERT INTO EPS (EPS_Nombre) VALUES ('Nueva EPS');
INSERT INTO EPS (EPS_Nombre) VALUES ('Sura');
INSERT INTO EPS (EPS_Nombre) VALUES ('Farmisanar');
INSERT INTO EPS (EPS_Nombre) VALUES ('Compensar');


-- ==============================
-- CREAR TABLA USUARIO
-- ==============================
CREATE TABLE USUARIO (
  Cedula BIGINT PRIMARY KEY,
  Nombre VARCHAR(120) NOT NULL,
  Apellido VARCHAR(120) NOT NULL,
  Direccion VARCHAR(120) NOT NULL,
  EPS TINYINT NOT NULL,
  Tel_Fijo NUMERIC,
  Celular NUMERIC NOT NULL,
  Correo VARCHAR(100) NOT NULL,
  Registrado_Por BIGINT NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(150) NOT NULL,
  Cargo TINYINT NOT NULL,
  Estado BOOLEAN NOT NULL,
  refresh_token varchar(700),
  firstLogin BOOLEAN,
  fecha_creacion date default (current_date()),
  CONSTRAINT fk_usuario_eps FOREIGN KEY (EPS) REFERENCES EPS(COD_EPS),
  CONSTRAINT fk_usuario_registra FOREIGN KEY (Registrado_Por) REFERENCES USUARIO(Cedula),
  CONSTRAINT fk_usuario_cargo FOREIGN KEY (Cargo) REFERENCES CARGO(ID)
);

-- ==============================
-- CREAR TABLA CLIENTE
-- ==============================
CREATE TABLE CLIENTE (
  Cedula BIGINT PRIMARY KEY,
  Nombre VARCHAR(120) NOT NULL,
  Apellido VARCHAR(120) NOT NULL,
  Tel_Fijo INT,
  Celular NUMERIC NOT NULL,
  Direccion_Cliente VARCHAR(120) NOT NULL,
  Correo VARCHAR(120),
  Registrado_por BIGINT NOT NULL,
  Estado BOOLEAN NOT NULL,
  fecha_creacion date default (current_date()),
  CONSTRAINT fk_cliente_usuario FOREIGN KEY (Registrado_por) REFERENCES USUARIO(Cedula)
);

-- ==============================
-- CREAR TABLA PRODUCTO
-- ==============================
CREATE TABLE PRODUCTO (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Pre_Uni FLOAT NOT NULL,
  Cant_Dispo INT NOT NULL,
  Tiempo_de_refrigeracion TINYINT NOT NULL,
  iva_total FLOAT NOT NULL,
  Registrado_Por BIGINT NOT NULL,
  Estado BOOLEAN NOT NULL,
  fecha_registro date default (current_date()),
  CONSTRAINT fk_producto_usuario FOREIGN KEY (Registrado_Por) REFERENCES USUARIO(Cedula)
);


-- ==============================
-- CREAR TABLA PEDIDO
-- ==============================
CREATE TABLE PEDIDO (
  Codigo INT AUTO_INCREMENT PRIMARY KEY,
  Fecha DATE NOT NULL,
  Direccion_C VARCHAR(120),
  total FLOAT NOT NULL,
  Pedido_Por BIGINT,
  Registrado_Por BIGINT NOT NULL,
  iva_total FLOAT NOT NULL,
  CONSTRAINT fk_pedido_cliente FOREIGN KEY (Pedido_Por) REFERENCES CLIENTE(Cedula),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (Registrado_Por) REFERENCES USUARIO(Cedula)
);

-- ==============================
-- CREAR TABLA DETALLE_PEDIDO
-- ==============================
CREATE TABLE DETALLE_PEDIDO (
  Prod_Vend INT NOT NULL,
  ID_Pedido INT NOT NULL,
  IVA FLOAT NOT NULL,
  Prec_Venta_Prod FLOAT NOT NULL,
  Cant_Producto INT NOT NULL,
  PRIMARY KEY (Prod_Vend, ID_Pedido),
  CONSTRAINT fk_det_pedido_prod FOREIGN KEY (Prod_Vend) REFERENCES PRODUCTO(ID),
  CONSTRAINT fk_det_pedido_pedido FOREIGN KEY (ID_Pedido) REFERENCES PEDIDO(Codigo)
);

-- ==============================
-- CREAR TABLA FACTURA_VENTA
-- ==============================
CREATE TABLE FACTURA_VENTA (
  ID_F BIGINT AUTO_INCREMENT PRIMARY KEY,
  Entregado_a BIGINT NOT NULL,
  Fecha_Registro DATE NOT NULL,
  Total  DECIMAL(18,2) NOT NULL,
  Registrado_Por BIGINT NOT NULL,
  iva_total  DECIMAL(18,2) NOT NULL,
  CONSTRAINT fk_factura_cliente FOREIGN KEY (Entregado_a) REFERENCES CLIENTE(Cedula),
  CONSTRAINT fk_factura_usuario FOREIGN KEY (Registrado_Por) REFERENCES USUARIO(Cedula)
);

-- ==============================
-- CREAR TABLA DETALLE_FACT_VEN
-- ==============================
CREATE TABLE DETALLE_FACT_VEN (
  Prod_Vend INT NOT NULL,
  ID_Fact_Venta BIGINT NOT NULL,
  IVA FLOAT NOT NULL,
  Prec_Venta_Prod FLOAT NOT NULL,
  Cant_Prod INT NOT NULL,
  Subtotal DECIMAL(18,2) GENERATED ALWAYS AS (Prec_Venta_Prod * Cant_Prod) STORED,
  Total_Linea DECIMAL(18,2) GENERATED ALWAYS AS ((Prec_Venta_Prod * Cant_Prod) + IVA) STORED,
  PRIMARY KEY (Prod_Vend, ID_Fact_Venta),
  CONSTRAINT fk_det_fact_prod FOREIGN KEY (Prod_Vend) REFERENCES PRODUCTO(ID),
  CONSTRAINT fk_det_fact_fact FOREIGN KEY (ID_Fact_Venta) REFERENCES FACTURA_VENTA(ID_F)
);

-- ==============================
-- CREAR TABLA PROVEEDOR
-- ==============================
CREATE TABLE PROVEEDOR (
  ID BIGINT AUTO_INCREMENT PRIMARY KEY,
  Nombre_Empresa VARCHAR(1000) NOT NULL,
  Tele INT NOT NULL,
  Celular BIGINT NOT NULL,
  Direccion_Emp VARCHAR(120) NOT NULL,
  Correo VARCHAR(120),
  Nombre_Contacto VARCHAR(120) NOT NULL,
  Registrado_por BIGINT NOT NULL,
  Estado BOOLEAN NOT NULL,
  CONSTRAINT fk_proveedor_usuario FOREIGN KEY (Registrado_por) REFERENCES USUARIO(Cedula)
);

-- ==============================
-- CREAR TABLA FACTURA_PROVEEDOR
-- ==============================
CREATE TABLE FACTURA_PROVEEDOR (
  ID_Fac_Prov INT AUTO_INCREMENT PRIMARY KEY,
  Fecha_Registro DATE NOT NULL,
  Total FLOAT NOT NULL,
  IVA FLOAT NOT NULL,
  Recibido_por BIGINT NOT NULL,
  ID_prov BIGINT NOT NULL,
  CONSTRAINT fk_factprov_usuario FOREIGN KEY (Recibido_por) REFERENCES USUARIO(Cedula),
  CONSTRAINT fk_factprov_prov FOREIGN KEY (ID_prov) REFERENCES PROVEEDOR(ID)
);

-- ==============================
-- CREAR TABLA DETALLE_FACT_PROV
-- ==============================
CREATE TABLE DETALLE_FACT_PROV (
  ID_fact_prove INT NOT NULL,
  id_product INT NOT NULL,
  prec_vent_prod FLOAT NOT NULL,
  cantidad_prod INT NOT NULL,
  PRIMARY KEY (ID_fact_prove, id_product),
  CONSTRAINT fk_det_factprov_fact FOREIGN KEY (ID_fact_prove) REFERENCES FACTURA_PROVEEDOR(ID_Fac_Prov),
  CONSTRAINT fk_det_factprov_prod FOREIGN KEY (id_product) REFERENCES PRODUCTO(ID)
);

-- ==============================
-- INSERCIONES DE EJEMPLO
-- ==============================

Insert into USUARIO(Cedula, Nombre, Apellido, Direccion, EPS, Celular,  Correo, Registrado_Por, username, password, Cargo, Estado,refresh_token)
Values ('1001219271', 'Daniel','Acuña', 'Calle 6 Sur#24-24', 1, 3214629118, 'daniel198@surtipollo.com', '1001219271', 'danielfacunam', '$2a$12$2OzvAUkPJ6HsrjF/rt3WU.o8jeeLUP36aWocTrcLikcfcvUhlabR2', 1,1,'');-- pass = zadoFal0*22

INSERT INTO CLIENTE
(Cedula, Nombre, Apellido, Tel_fijo, Celular, Direccion_Cliente, Correo, Registrado_por,Estado)
VALUES
(1001219271, 'Daniel', 'Acuña', 6887422, 3214629118, 'calle', 'daniel-fam51@hotmail.com', 1001219271,1);

INSERT INTO CLIENTE
(Cedula, Nombre, Apellido, Tel_fijo, Celular, Direccion_Cliente, Correo, Registrado_por,Estado)
VALUES
(79944569, 'Cesar', 'Acuña', 6887422, 3143362863, 'calle 13c #126-80', 'cesar123aap@gmail.com', 1001219271,1);

INSERT INTO PRODUCTO
(Nombre, Pre_Uni, Cant_Dispo, Tiempo_de_refrigeracion, iva_total, Registrado_Por, Estado)
VALUES
('Pechuga', 3600, 55, 3, 3, 1001219271, 1),
('Gallina', 23000, 160, 3, 3, 1001219271,1),
('Alas', 1500, 98, 3, 3, 1001219271,1);


-- ==============================
-- CONSULTAS DE PRUEBA
-- ==============================
SELECT * FROM USUARIO;
SELECT * FROM CARGO;
SELECT * FROM factura_venta;
SELECT * FROM DETALLE_FACT_VEN;
SELECT * FROM CLIENTE;
	

alter table CLIENTE
add column fecha_registro date default (current_date());

ALTER TABLE DETALLE_FACT_VEN
  ADD COLUMN Subtotal DECIMAL(18,2) GENERATED ALWAYS AS (Prec_Venta_Prod * Cant_Prod) STORED,
  ADD COLUMN Total_Linea DECIMAL(18,2) GENERATED ALWAYS AS ((Prec_Venta_Prod * Cant_Prod) + IVA) STORED;

ALTER TABLE FACTURA_VENTA
  MODIFY Total DECIMAL(18,2),
  MODIFY iva_total DECIMAL(18,2),
  MODIFY Fecha_Registro DATETIME;


SELECT f.id_f, c.nombre AS cliente, f.fecha_registro, f.total, f.iva_total, f.registrado_por
      FROM factura_venta f
      JOIN cliente c ON f.Entregado_a = c.cedula
      WHERE 1=1;
      
      SELECT
        f.id_f,
        c.nombre AS cliente,
        c.cedula,
        f.fecha_registro,
        f.total,
        f.iva_total,
        u.username AS registrado_por
      FROM factura_venta f
      JOIN cliente c ON f.entregado_a = c.cedula
      JOIN usuario u ON f.registrado_por = u.Cedula;
      
	SELECT
        f.Prod_vend,
        c.nombre AS nombre_producto,
        f.Cant_Prod as cantidad,
        f.prec_venta_prod as precio_unitario,
        f.IVA
      FROM DETALLE_FACT_VEN f
      JOIN PRODUCTO c ON f.Prod_vend = c.ID
      where ID_FACT_VENTA = 3
      
   update CLIENTE set Estado=1 where cedula='46672594'
      
DELIMITER $$

CREATE TRIGGER after_insert_detalle_factura
AFTER INSERT ON DETALLE_FACT_VEN
FOR EACH ROW
BEGIN
    UPDATE producto
    SET Cant_Dispo = Cant_Dispo - NEW.Cant_Prod
    WHERE ID = NEW.Prod_vend;
END$$

DELIMITER ;

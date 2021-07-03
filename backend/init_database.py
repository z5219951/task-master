import sqlite3



if __name__ == '__main__':
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = 'drop table if exists users'
    c.execute(query)
    query = 'drop table if exists tasks'
    c.execute(query)
    # create table users
    query = """
            CREATE TABLE IF NOT EXISTS users (
                id              integer     primary key,
                username        text        unique not null,
                password        text        not null,
                email           text        unique not null,
                first_name      text        not null,
                last_name       text        not null,
                phone_number    text        not null,
                company         text        ,
                recovery        integer
            );
            """
    c.execute(query)

    # create table tasks
    query = """
            CREATE TABLE IF NOT EXISTS tasks (
                id              integer     primary key,
                owner           integer     not null,
                title           text        not null,
                description     text        not null,
                creation_date   text        not null,
                deadline        text        ,
                labels          text        ,
                current_state   text        not null,
                progress        integer     ,
                time_estimate   integer     ,
                difficulty      text        ,
                foreign key     (owner)     references users (id)
            );
            """
    c.execute(query)
    conn.commit()

    # create table groups
    query = """
            CREATE TABLE IF NOT EXISTS groups (
                id              integer     primary key,
                creator         integer     not null,
                title           text        not null,
                description     text        not null,
                creation_date   text        not null,
                user            integer     not null,
                foreign key     (creator)   references users (id)
            );
            """
    c.execute(query)
    conn.commit()

    # insert test data
    query = f"""
                INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
                VALUES ('charles', '123456Qq', '1105282259@qq.com', 'Yue', 'Qi', '12345', '123');
                """
    c.execute(query)
    
    conn.commit()
    c.close()
    conn.close()